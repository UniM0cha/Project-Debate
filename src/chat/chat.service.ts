import { Injectable, Logger } from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { OpinionType, TopicUsers } from 'src/topic/entity/topic-users.entity';
import { TopicService } from 'src/topic/topic.service';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private usersService: UsersService,
    private topicService: TopicService,
  ) {}
  private readonly logger = new Logger(ChatService.name);

  async validateAndSaveChat(data: any): Promise<{
    state: number;
    date?: Date;
    nickname?: string;
    opinionType?: OpinionType;
  }> {
    /**상태코드
     * 0 : 저장 성공
     * 1 : 존재하지 않는 유저
     * 2 : 유효하지 않는 주제
     * 3 : 유저가 의견을 제시하지 않음
     */

    const user: Users = await this.usersService.findOneById(data.userId);
    if (user) {
      const reserve: TopicReserve = await this.topicService.findOneTopicReserve(
        data.reserveId,
      );
      if (reserve) {
        const opinionType: OpinionType =
          await this.topicService.findUserOpinionType(user, reserve);
        if (opinionType) {
          // 채팅 저장
          const today = new Date();
          const nickname = user.nickname;
          const chat = new Chat();
          chat.createChat(today, data.opinion_input, user, reserve);
          await this.chatRepository.save(chat);
          this.logger.debug(`채팅 저장 성공`);
          return {
            state: 0,
            date: today,
            nickname: nickname,
            opinionType: opinionType,
          };
        } else {
          this.logger.error(
            `채팅 저장 실패: 유저가 의견을 제시하지 않았습니다.`,
          );
          return { state: 3 };
        }
      } else {
        this.logger.error(`채팅 저장 실패: 유효하지 않은 주제입니다.`);
        return { state: 2 };
      }
    } else {
      this.logger.error(`채팅 저장 실패: 유저가 존재하지 않습니다.`);
      return { state: 1 };
    }
  }
}
