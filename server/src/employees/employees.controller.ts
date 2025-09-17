import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeQueryDto,
  EmployeeResponseDto,
} from './dto';
import { EmployeeDetailsResponseDto } from './dto/employee-response.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async getEmployees(
    @Query() query: EmployeeQueryDto,
  ): Promise<EmployeeResponseDto[]> {
    return this.employeesService.getAll(query.search);
  }

  @Get(':id')
  async getEmployee(
    @Param('id') id: string,
  ): Promise<EmployeeDetailsResponseDto> {
    return this.employeesService.getById(id);
  }

  @Post()
  async createEmployee(
    @Body() payload: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.create(payload);
  }

  @Put(':id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() payload: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(id, payload);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEmployee(@Param('id') id: string): Promise<void> {
    await this.employeesService.delete(id);
  }
}
