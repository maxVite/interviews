import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  position: string;
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
  @IsDateString()
  scheduledAt: string;
  @IsUUID(4)
  userId: string;
}
