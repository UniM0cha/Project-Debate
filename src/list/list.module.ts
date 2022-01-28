import { Module } from '@nestjs/common';
import { TopicModule } from 'src/topic/topic.module';
import { ListController } from './list.controller';

@Module({
  imports: [TopicModule],
  controllers: [ListController],
})
export class ListModule {}
