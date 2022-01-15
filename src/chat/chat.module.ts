import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersRepository } from 'src/users/users.repository';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatRepository]), UsersModule],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
