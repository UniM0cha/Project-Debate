import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  Session,
} from '@nestjs/common';
import { TopicReserve } from './entity/topic-reservation.entity';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(TopicController.name);

  /**찬성 버튼을 클릭했을 때의 요청 */
  @Post('/agree')
  async selectAgree(@Session() session) {
    const userId: string = session.userData.userId;
    const reserveId: number = session.reserveId;
    this.logger.debug(
      `Agree Request: userId: ${userId}, reserveId: ${reserveId}`,
    );

    if (userId && reserveId) {
      const currentReserve: TopicReserve =
        await this.topicService.findCurrentReserve();

      if (currentReserve.reserveId === reserveId) {
        await this.topicService.addAgree(userId, reserveId);
        return 200;
      } else {
        throw new BadRequestException('현재 진행중인 주제가 아닙니다.');
      }
    } else {
      this.logger.debug(`등록된 유저 또는 주제가 없습니다.`);
      throw new BadRequestException();
    }
  }

  /**반대 버튼을 클릭했을 때의 요청 */
  @Post('/disagree')
  async selectDisagree(@Session() session) {
    const userId: string = session.userData.userId;
    const reserveId: number = session.reserveId;
    this.logger.debug(
      `Disagree Request: userId: ${userId}, reserveId: ${reserveId}`,
    );

    if (userId && reserveId) {
      const currentReserve: TopicReserve =
        await this.topicService.findCurrentReserve();
      if (currentReserve.reserveId === reserveId) {
        await this.topicService.addDisagree(userId, reserveId);
        return 200;
      } else {
        throw new BadRequestException('현재 진행중인 주제가 아닙니다.');
      }
    } else {
      this.logger.debug(`등록된 유저 또는 주제가 없습니다.`);
      throw new BadRequestException();
    }
  }
}
