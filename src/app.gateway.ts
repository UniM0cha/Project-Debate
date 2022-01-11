import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'message', cors: true })
export class ChatGateway {
  @WebSocketServer()
  Server;

  @SubscribeMessage('new-message-to-server')
  handleMessage(@MessageBody() data): void {
    this.Server.emit('new-message-to-client', {
      newmessage: data.opinion_input,
    });
  }
}
