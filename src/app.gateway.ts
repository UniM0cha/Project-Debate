import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat/chat.service';

@WebSocketGateway({ namespace: 'message', cors: true })
export class ChatGateway {
  private readonly logger = new Logger(ChatGateway.name);
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('new-message-to-server')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ): Promise<void> {
    this.logger.debug(
      `New Message from Client: ${JSON.stringify(data, null, 4)}`,
    );

    const result = await this.chatService.validateAndSaveChat(data);
    const state = result.state;

    // 메시지를 보낸 클라이언트에게만 상태를 알려준다.
    client.emit('chat-state-to-client', { state: state });

    // 저장이 성공했을 때에만 전체에게 메시지를 뿌려준다.
    if (state === 0) {
      this.server.emit('new-message-to-client', {
        nickname: result.nickname,
        newmessage: data.opinion_input,
        date: result.date,
        opinionType: result.opinionType,
      });
    }
  }
}
