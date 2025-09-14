import { IsOptional, IsUUID } from 'class-validator';

export class InterviewQueryDto {
  @IsOptional()
  @IsUUID(4)
  userId?: string;
}
