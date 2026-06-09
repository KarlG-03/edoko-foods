import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAvailable() {
    return this.prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { category: 'asc' },
    });
  }

  async findById(id: string) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }

  async create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({ data: dto });
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    await this.findById(id);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.menuItem.delete({ where: { id } });
  }
}
