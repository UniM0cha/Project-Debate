import {
  Controller,
  Get,
  Res,
  Session,
  Param,
  Logger,
  ParseIntPipe,
  NotFoundException,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { MainAuthGuard } from 'src/auth/passport/main.guard';
import { ChatService } from 'src/chat/chat.service';
import { TopicDataDto } from 'src/topic/dto/topic.dto';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ListService } from './list.service';

@Controller('list')
@UseGuards(MainAuthGuard)
export class ListController {
  constructor(
    private readonly topicService: TopicService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger(ListController.name);

  @Get('/')
  @Redirect('/list/page/1')
  redirectToPageOne() {}

  @Get('/page/:page')
  async getAllTopics(
    @Req() req,
    @Res() res,
    @Param('page', ParseIntPipe) page: number,
  ) {
    // await this.topicServices.addTestData();
    // const topicReserves: TopicReserve[] =
    //   await this.topicServices.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicService.findAllTopics();
    let getPassedTopicList: TopicReserve[] =
      await this.topicService.findPASSEDTopicReservesWithTopic();
    // const getPassedTopicList: TopicReserve[] =
    //   await this.topicServices.findPASSEDTopicReservesWithTopic();
    const topicReserveCount: number = await this.topicService.getPassedCount();
    const topicReservePageCount: number = Math.floor(
      (topicReserveCount - 1) / 10 + 1,
    );

    const getEndTime: TopicReserve[] = await this.topicService.getPassedList();
    const getEndTimeList: Date[] = getEndTime.map((getEndTime) => {
      getEndTime.startDate.setDate(getEndTime.startDate.getDate() - 1);
      return getEndTime.startDate;
    });

    let getPassedListValue = [];

    getPassedTopicList.forEach((element, index) => {
      getPassedListValue.push({
        countNumber: index + 1,
        reserveId: element.reserveId,
        startDate: element.startDate,
        endDate: element.endDate,
        topic: {
          topicName: element.topic.topicName,
        },
      });
    });

    getPassedListValue.reverse();

    this.logger.debug(
      `getPassedListValue: ${JSON.stringify(getPassedListValue, null, 4)}`,
    );
    getPassedListValue = getPassedListValue.slice((page - 1) * 10, page * 10);

    const authDto: AuthDto = await this.authService.setAuthDto(req.user.userId);

    res.render('ex_debate_list', {
      getPassedListValue: getPassedListValue,
      ...authDto,
      topics: topics,
      topicReserveCount: topicReserveCount,
      topicReservePageCount: topicReservePageCount,
    });
  }

  // id로 해당 주제 예약번호 받아옴
  @Get('/view/:id')
  async getChat(
    @Req() req,
    @Param('id', ParseIntPipe) reserveId: number,
    @Session() session,
    @Res() res,
  ) {
    // reserveId 가 유효한지 확인
    const topicReserve: TopicReserve =
      await this.topicService.findOnePassedTopicReserve(reserveId);
    if (topicReserve) {
      session.reserveId = reserveId;
      const authDto: AuthDto = await this.authService.setAuthDto(
        req.user.userId,
      );
      const topic: TopicDataDto = await this.topicService.setListTopicDto(
        reserveId,
      );
      const data = { ...authDto, topic: topic };
      this.logger.debug(`viewDto: ${JSON.stringify(data)}`);
      res.render('ex_debate_show', data);
    } else {
      throw new NotFoundException();
    }
  }
}
