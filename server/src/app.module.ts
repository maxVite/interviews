import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SharedConfigModule } from '@app/config';

@Module({
  imports: [SharedConfigModule, PrismaModule],
})
export class AppModule {}
