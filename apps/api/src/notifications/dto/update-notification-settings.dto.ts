import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateNotificationSettingsDto {
  @IsBoolean()
  @IsOptional()
  enableInApp?: boolean;

  @IsBoolean()
  @IsOptional()
  enableEmail?: boolean;

  @IsInt()
  @Min(1)
  @IsOptional()
  reminderHoursBefore?: number;
}
