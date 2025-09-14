import { InterviewStatus } from 'generated/prisma';

export class InterviewResponseDto {
  id: string;
  position: string;
  notes?: string;
  scheduledAt: Date;
  status: InterviewStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
