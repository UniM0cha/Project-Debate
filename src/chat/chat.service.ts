import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private usersService: UsersService,
  ) {}
  private readonly logger = new Logger(ChatService.name);

  async saveChat(data: any) {
    const user = await this.usersService.findOne(data.userId);
    const chat = new Chat();
    chat.createChat(data, user);
    this.chatRepository.save(chat);
  }
}
