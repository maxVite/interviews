import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SharedConfigModule } from '@app/config';
import { EmployeesModule } from './employees/employees.module';
import { InterviewsModule } from './interviews/interviews.module';
import { HttpLoggerMiddleware } from './middlewares/http-logger.middleware';

@Module({
  imports: [
    SharedConfigModule,
    PrismaModule,
    EmployeesModule,
    InterviewsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
