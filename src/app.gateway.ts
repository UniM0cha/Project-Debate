import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'message', cors: true })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer()
  Server;

  @SubscribeMessage('new-message-to-server')
  handleMessage(@MessageBody() data): void {
    this.logger.debug(`Data from client: ${JSON.stringify(data, null, 4)}`);
    this.Server.emit('new-message-to-client', {
      nickname: data.nickname,
      newmessage: data.opinion_input,
      date: data.date,
    });
  }
}
