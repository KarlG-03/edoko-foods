import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly log = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => NotificationsService))
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: { include: { menuItem: true } } },
      orderBy: { eventDate: 'asc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { menuItem: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: CreateOrderDto) {
    const menuItemIds = dto.items.map((i) => i.menuItemId);
    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, isAvailable: true },
    });

    const priceMap = new Map(menuItems.map((m) => [m.id, m.price]));

    const orderItems = dto.items.map((item) => {
      const unitPrice = priceMap.get(item.menuItemId);
      if (unitPrice === undefined) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found or unavailable`);
      }
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    const order = await this.prisma.order.create({
      data: {
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        eventDate: new Date(dto.eventDate),
        eventTime: dto.eventTime,
        eventLocation: dto.eventLocation,
        guestCount: dto.guestCount,
        specialRequests: dto.specialRequests,
        totalAmount,
        items: { create: orderItems },
      },
      include: { items: { include: { menuItem: true } } },
    });

    this.log.log(`Order ${order.id} created for ${dto.customerName}`);

    this.notificationsService
      .createOrderNotification(order.id, dto.customerName)
      .catch((err) => this.log.warn(`Failed to create notification: ${err}`));

    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    await this.findById(id);
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: { include: { menuItem: true } } },
    });
  }

  async findUpcoming(hoursAhead: number) {
    const now = new Date();
    const cutoff = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
    return this.prisma.order.findMany({
      where: {
        eventDate: { gte: now, lte: cutoff },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
      include: { items: { include: { menuItem: true } } },
      orderBy: { eventDate: 'asc' },
    });
  }
}
