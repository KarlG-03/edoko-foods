import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  menuItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @IsDateString()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  eventTime: string;

  @IsString()
  @IsNotEmpty()
  eventLocation: string;

  @IsInt()
  @Min(1)
  guestCount: number;

  @IsString()
  @IsOptional()
  specialRequests?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
