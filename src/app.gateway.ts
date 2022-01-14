import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat/chat.service';

@WebSocketGateway({ namespace: 'message', cors: true })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  Server;

  @SubscribeMessage('new-message-to-server')
  handleMessage(@MessageBody() data): void {
    this.logger.debug(`Data from client: ${JSON.stringify(data, null, 4)}`);

    this.chatService.saveChat(data);

    this.Server.emit('new-message-to-client', {
      nickname: data.nickname,
      newmessage: data.opinion_input,
      date: data.date,
    });
  }
}
