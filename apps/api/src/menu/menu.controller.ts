import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { PublicRoute } from '../common/decorators/public-route.decorator';
import { AdminGuard } from '../admin/admin.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @PublicRoute()
  findAvailable() {
    return this.menuService.findAvailable();
  }

  @Get('all')
  @UseGuards(AdminGuard)
  findAll() {
    return this.menuService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateMenuItemDto) {
    return this.menuService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.menuService.remove(id);
  }
}
