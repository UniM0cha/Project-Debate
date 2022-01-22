import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from 'src/topic/topic.module';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository]),
    UsersModule,
    TopicModule,
  ],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
