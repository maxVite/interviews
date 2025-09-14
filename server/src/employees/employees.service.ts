import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(search?: string) {
    return this.prisma.user.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastNames: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
    });
  }

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(payload: CreateEmployeeDto) {
    return this.prisma.user.create({
      data: payload,
    });
  }

  async update(id: string, payload: UpdateEmployeeDto) {
    return this.prisma.user.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: string) {
    await this.prisma.$transaction([
      this.prisma.interview.deleteMany({
        where: { userId: id },
      }),
      this.prisma.user.delete({
        where: { id },
      }),
    ]);
  }
}
