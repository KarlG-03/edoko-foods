import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MenuCategory } from '@prisma/client';

export class CreateMenuItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(MenuCategory)
  category: MenuCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
