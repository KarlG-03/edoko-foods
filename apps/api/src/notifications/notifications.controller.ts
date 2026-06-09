import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { AdminGuard } from '../admin/admin.guard';

@Controller('notifications')
@UseGuards(AdminGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query('unread') unread?: string) {
    return this.notificationsService.findAll(unread === 'true');
  }

  @Get('unread-count')
  getUnreadCount() {
    return this.notificationsService.getUnreadCount();
  }

  @Patch('read-all')
  markAllAsRead() {
    return this.notificationsService.markAllAsRead();
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Get('settings')
  getSettings(@Req() req: Request & { user?: { userId: string } }) {
    return this.notificationsService.getSettings(req.user!.userId);
  }

  @Patch('settings')
  updateSettings(
    @Req() req: Request & { user?: { userId: string } },
    @Body() dto: UpdateNotificationSettingsDto,
  ) {
    return this.notificationsService.updateSettings(req.user!.userId, dto);
  }
}
