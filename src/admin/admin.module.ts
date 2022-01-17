import { Module } from '@nestjs/common';
import { TopicModule } from 'src/topic/topic.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [TopicModule],
  controllers: [AdminController],
})
export class AdminModule {}
