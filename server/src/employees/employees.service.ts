import { Injectable, NotFoundException } from '@nestjs/common';
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
    const employee = await this.prisma.user.findUnique({
      where: { id },
      include: {
        interviews: {
          select: {
            id: true,
            position: true,
            notes: true,
            status: true,
            scheduledAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
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
      include: {
        interviews: {
          select: {
            id: true,
            position: true,
            notes: true,
            scheduledAt: true,
            status: true,
          },
        },
      },
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
