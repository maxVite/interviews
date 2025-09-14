import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
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
  @IsPhoneNumber()
  phone?: string;
}
