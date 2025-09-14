import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import {
  CreateInterviewDto,
  InterviewQueryDto,
  InterviewResponseDto,
} from './dto';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get()
  async getInterviews(
    @Query() query: InterviewQueryDto,
  ): Promise<InterviewResponseDto[]> {
    if (query.userId) {
      return this.interviewsService.getByUserId(query.userId);
    }
    return this.interviewsService.getAll();
  }

  @Post()
  async createInterview(
    @Body() payload: CreateInterviewDto,
  ): Promise<InterviewResponseDto> {
    return this.interviewsService.create(payload);
  }
}
