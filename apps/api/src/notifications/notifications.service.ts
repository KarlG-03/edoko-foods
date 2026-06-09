import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationsService {
  private readonly log = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(onlyUnread = false) {
    return this.prisma.notification.findMany({
      where: onlyUnread ? { isRead: false } : undefined,
      include: { order: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount() {
    return this.prisma.notification.count({ where: { isRead: false } });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead() {
    return this.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.notificationSetting.findUnique({
      where: { userId },
    });
    if (!settings) {
      settings = await this.prisma.notificationSetting.create({
        data: { userId },
      });
    }
    return settings;
  }

  async updateSettings(userId: string, dto: UpdateNotificationSettingsDto) {
    return this.prisma.notificationSetting.upsert({
      where: { userId },
      create: { userId, ...dto },
      update: dto,
    });
  }

  async createOrderNotification(orderId: string, customerName: string) {
    const notification = await this.prisma.notification.create({
      data: {
        orderId,
        type: NotificationType.IN_APP,
        title: 'New Catering Order',
        message: `New order from ${customerName}. Review and confirm the details.`,
        scheduledAt: new Date(),
        sentAt: new Date(),
      },
    });

    await this.trySendEmailNotification(
      'New Catering Order',
      `You have a new catering order from ${customerName}. Log in to the admin panel to review and confirm.`,
    );

    return notification;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async checkUpcomingEvents() {
    this.log.log('Checking for upcoming catering events...');

    const adminUsers = await this.prisma.user.findMany({
      where: { isSuperAdmin: true },
      include: { notificationSettings: true },
    });

    if (!adminUsers.length) return;

    const maxHours = Math.max(
      ...adminUsers.map((u) => u.notificationSettings?.reminderHoursBefore ?? 24),
      24,
    );

    const now = new Date();
    const cutoff = new Date(now.getTime() + maxHours * 60 * 60 * 1000);

    const upcomingOrders = await this.prisma.order.findMany({
      where: {
        eventDate: { gte: now, lte: cutoff },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
      include: { items: true },
    });

    for (const order of upcomingOrders) {
      const existing = await this.prisma.notification.findFirst({
        where: {
          orderId: order.id,
          title: { startsWith: 'Upcoming Catering' },
          createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) },
        },
      });

      if (existing) continue;

      const hoursUntil = Math.round(
        (order.eventDate.getTime() - now.getTime()) / (60 * 60 * 1000),
      );

      await this.prisma.notification.create({
        data: {
          orderId: order.id,
          type: NotificationType.IN_APP,
          title: 'Upcoming Catering Event',
          message: `Catering for ${order.customerName} at ${order.eventLocation} is in ~${hoursUntil}h.`,
          scheduledAt: now,
          sentAt: now,
        },
      });

      await this.trySendEmailNotification(
        'Upcoming Catering Reminder',
        `Reminder: Catering for ${order.customerName} at ${order.eventLocation} is in approximately ${hoursUntil} hours (${order.eventTime}).`,
      );
    }

    if (upcomingOrders.length) {
      this.log.log(`Sent reminders for ${upcomingOrders.length} upcoming event(s)`);
    }
  }

  private async trySendEmailNotification(subject: string, body: string) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { isSuperAdmin: true },
        include: { notificationSettings: true },
      });

      for (const admin of admins) {
        if (admin.notificationSettings?.enableEmail === false) continue;
        await this.emailService.sendGenericEmail(admin.email, subject, body);
      }
    } catch (err) {
      this.log.warn(`Failed to send email notification: ${err}`);
    }
  }
}
