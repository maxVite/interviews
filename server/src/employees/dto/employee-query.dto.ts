import { IsOptional, IsString, MaxLength } from 'class-validator';

export class EmployeeQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
