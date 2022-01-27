import { Controller, Logger, Post, Res, Session } from '@nestjs/common';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  private readonly logger = new Logger(ChatController.name);

  @Post('/all')
  async getAllChat(@Session() session): Promise<any> {
    /**상태코드
     * 0: 정상적으로 채팅내역을 보냄
     * 1: 주제 예약을 찾지 못함
     */

    const reserveId = session.reserveId;
    if (reserveId) {
      const chat: Chat[] = await this.chatService.getAllChat(reserveId);

      this.logger.debug(`전체 채팅 내용 보내기 성공`);
      return { state: 0, chat: chat };
    } else {
      this.logger.error(
        `전체 채팅 내용 보내기 실패: 유효하지 않은 주제 예약 번호입니다.`,
      );
      return { state: 1 };
    }
  }
}
