import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PublicRoute } from '../common/decorators/public-route.decorator';
import { AdminGuard } from '../admin/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @PublicRoute()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
