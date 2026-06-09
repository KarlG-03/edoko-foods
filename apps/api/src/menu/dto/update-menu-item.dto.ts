import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { MenuCategory } from '@prisma/client';

export class UpdateMenuItemDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsEnum(MenuCategory)
  @IsOptional()
  category?: MenuCategory;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
