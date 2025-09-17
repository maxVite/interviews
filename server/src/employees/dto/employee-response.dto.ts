import { OmitType } from '@nestjs/mapped-types';
import { InterviewResponseDto } from 'src/interviews/dto/interview-response.dto';

export class EmployeeResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastNames: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class EmployeeDetailsResponseDto extends EmployeeResponseDto {
  interviews: Pick<
    InterviewResponseDto,
    'id' | 'position' | 'notes' | 'scheduledAt' | 'status' | 'createdAt'
  >[];
}
