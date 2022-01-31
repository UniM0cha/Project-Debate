import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OpinionType } from './entity/topic-users.entity';
import { TopicService } from './topic.service';

@WebSocketGateway({ namespace: 'topic', cors: true })
export class TopicGateway {
  private readonly logger = new Logger(TopicGateway.name);
  constructor(private topicService: TopicService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('request-refresh-opinion-type')
  async sendOpinionType(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    this.logger.debug(`Opinion Type Refresh Request - clientId: ${client.id}`);
    const reserveId: number = data.reserveId;
    const amount = await this.topicService.getAgreeDisagree(reserveId);
    if (amount) {
      client.emit('refresh-opinion-type', {
        agree: amount.agree,
        disagree: amount.disagree,
      });
    }
  }

  @SubscribeMessage('opinion-type-to-server')
  async receiveOpinionType(
    @ConnectedSocket() client: Socket,
    @MessageBody() data,
  ) {
    this.logger.debug(
      `New Opinion Type Request: ${JSON.stringify(data, null, 4)}`,
    );
    const state = await this.topicService.validateAndSaveOpinionType(data);
    client.emit('option-type-state-to-client', { state: state });

    if (state === 0) {
      const reserveId: number = data.reserveId;
      const amount = await this.topicService.getAgreeDisagree(reserveId);
      if (amount) {
        this.server.emit('refresh-opinion-type', {
          agree: amount.agree,
          disagree: amount.disagree,
        });
      }
    }
  }
}
