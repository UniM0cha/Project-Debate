import {
  Controller,
  Logger,
  Post,
  Req,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OpinionType } from './entity/topic-users.entity';
import { TopicService } from './topic.service';

@Controller('topic')
@UseGuards(AuthGuard('jwt'))
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(TopicController.name);

  /**찬성 버튼을 클릭했을 때의 요청 */
  @Post('/agree')
  async selectAgree(@Req() req, @Session() session) {
    const userId: string = req.user.userId;
    const reserveId: number = session.reserveId;
    this.logger.debug(
      `Agree Request: userId: ${userId}, reserveId: ${reserveId}`,
    );

    await this.topicService.addAgreeDisagree(
      userId,
      reserveId,
      OpinionType.AGREE,
    );
    return;
  }

  /**반대 버튼을 클릭했을 때의 요청 */
  @Post('/disagree')
  async selectDisagree(@Req() req, @Session() session) {
    const userId: string = req.user.userId;
    const reserveId: number = session.reserveId;
    this.logger.debug(
      `Disagree Request: userId: ${userId}, reserveId: ${reserveId}`,
    );

    await this.topicService.addAgreeDisagree(
      userId,
      reserveId,
      OpinionType.DISAGREE,
    );
    return;
  }
}
