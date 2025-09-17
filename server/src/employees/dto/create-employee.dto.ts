import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastNames: string;
  @IsOptional()
  @IsString()
  phone?: string;
}
