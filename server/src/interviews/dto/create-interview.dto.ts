import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { InterviewStatus } from 'generated/prisma';

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
  @IsEnum(InterviewStatus)
  status: InterviewStatus;
  @IsUUID(4)
  userId: string;
}
