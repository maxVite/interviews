import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInterviewDto } from './dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return this.prisma.interview.findMany();
  }

  async getByUserId(userId: string) {
    return this.prisma.interview.findMany({
      where: { userId },
    });
  }

  async create(payload: CreateInterviewDto) {
    return this.prisma.interview.create({
      data: {
        ...payload,
        scheduledAt: new Date(payload.scheduledAt),
      },
    });
  }
}
