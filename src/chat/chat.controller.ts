import { Controller, Logger, Param, Post, Res, Session } from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { TopicService } from 'src/topic/topic.service';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatController.name);

  /**Session에서 reserveId를 받아와서 채팅내용을 보내준다. */
  @Post('/all')
  async getAllChat(@Session() session): Promise<any> {
    /**상태코드
     * 0: 정상적으로 채팅내역을 보냄
     * 1: 주제 예약을 찾지 못함
     */
    const reserveId = session.reserveId;
    const result = await this.chatService.validateAndGetAllChat(reserveId);
    return result;
  }
}
