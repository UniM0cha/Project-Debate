import { Injectable, Logger } from '@nestjs/common';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { OpinionType, TopicUsers } from 'src/topic/entity/topic-users.entity';
import { TopicService } from 'src/topic/topic.service';
import { Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { MoreThan } from 'typeorm';
import { appendFile } from 'fs';
import { AppController } from 'src/app.controller';

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
     * 4 : 도배로 인한 채팅 금지
     */

    const user: Users = await this.usersService.findOneById(data.userId);
    if (!user) {
      this.logger.error(`채팅 저장 실패: 유저가 존재하지 않습니다.`);
      return { state: 1 };
    }

    const reserve: TopicReserve =
      await this.topicService.findOneProceedingTopicReserve(data.reserveId);
    if (!reserve) {
      this.logger.error(`채팅 저장 실패: 유효하지 않은 주제입니다.`);
      return { state: 2 };
    }

    const opinionType: OpinionType =
      await this.topicService.findUserOpinionType(user, reserve);
    if (!opinionType) {
      this.logger.error(`채팅 저장 실패: 유저가 의견을 제시하지 않았습니다.`);
      return { state: 3 };
    }

    ////////////////////////////////////////////////////////

    const today = new Date();
    const nickname = user.nickname;
    const chat = new Chat();

    const minusday = new Date();
    minusday.setSeconds(today.getSeconds() - 5);

    this.logger.debug(`today: ${JSON.stringify(today, null, 4)}`);
    this.logger.debug(`minusday: ${JSON.stringify(minusday, null, 4)}`);

    // 수정
    const chattingList: Chat[] = await this.getOneChatTime(data.userId);

    this.logger.debug(`chattingList: ${JSON.stringify(chattingList, null, 4)}`);

    if (chattingList[0] != undefined) {
      if (chattingList[0].chatDate >= minusday) {
        this.logger.error(`채팅 저장 실패: 도배로 인해 채팅이 제한되었습니다.`);
        return { state: 4 };
      }
    }

    chat.createChat(today, data.opinion_input, user, reserve, opinionType);
    await this.chatRepository.save(chat);
    this.logger.debug(`채팅 저장 성공`);
    return {
      state: 0,
      date: today,
      nickname: nickname,
      opinionType: opinionType,
    };
  }

  ////////////////////////////////////////////////////////

  async getAllChat(reserveId: number): Promise<Chat[]> {
    const topicReserve: TopicReserve =
      await this.topicService.findOneTopicReserve(reserveId);
    return await this.chatRepository.find({ topicReserve: topicReserve });
  }

  async getOneChatTime(usersId): Promise<Chat[]> {
    return await this.chatRepository.find({
      where: { users: usersId },
      skip: 3,
      take: 1,
      order: { chatDate: 'DESC' },
      relations: ['users'],
    });
  }

  async validateAndGetAllChat(
    reserveId: number,
  ): Promise<{ state: number; chat?: any }> {
    /**상태코드
     * 0: 정상적으로 채팅내역을 보냄
     * 1: 주제 예약을 찾지 못함
     */

    const topicReserve: TopicReserve =
      await this.topicService.findOneTopicReserve(reserveId);
    if (topicReserve) {
      const chat: Chat[] = await this.chatRepository.find({
        where: { topicReserve: topicReserve },
        relations: ['users'],
      });

      const compressedChat = chat.map((chat) => {
        return {
          chatDate: chat.chatDate,
          chatMessage: chat.chatMessage,
          opinionType: chat.opinionType,
          nickname: chat.users.nickname,
        };
      });
      this.logger.debug(`전체 채팅 내용 보내기 성공`);
      return { state: 0, chat: compressedChat };
    } else {
      this.logger.error(
        `전체 채팅 내용 보내기 실패: 유효하지 않은 주제 예약 번호입니다.`,
      );
      return { state: 1 };
    }
  }
}
