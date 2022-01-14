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
    console.log(data.date);
    this.Server.emit('new-message-to-client', {
      nickname: data.nickname,
      newmessage: data.opinion_input,
      date: data.date,
    });
  }
}
