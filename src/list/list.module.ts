import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { ChatModule } from 'src/chat/chat.module';
import { TopicModule } from 'src/topic/topic.module';
import { ListController } from './list.controller';

@Module({
  imports: [TopicModule, ChatModule, forwardRef(() => AppModule)],
  controllers: [ListController],
})
export class ListModule {}
