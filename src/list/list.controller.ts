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
  UseFilters,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { MainAuthGuard } from 'src/auth/passport/main.guard';
import { ChatService } from 'src/chat/chat.service';
import { HttpExceptionFilter } from 'src/http-exception.filter';
import { TopicDto } from 'src/topic/dto/topic.dto';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ListService } from './list.service';

@Controller('list')
@UseGuards(MainAuthGuard)
@UseFilters(new HttpExceptionFilter())
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

    // const getEndTimeList: Date[] = getEndTime.map((getEndTime) => {
    //   getEndTime.reserveDate.setDate(getEndTime.reserveDate.getDate() - 1);
    //   return getEndTime.reserveDate;
    // });
    //getEndTimeList.reverse();

    // getPassedTopicList = getPassedTopicList.slice((page - 1) * 10, page * 10);

    let arr1 = [];

    getPassedTopicList.forEach((element, index) => {
      arr1.push({
        countNumber: index + 1,
        reserveId: element.reserveId,
        startDate: element.startDate,
        endDate: element.endDate,
        topic: {
          topicName: element.topic.topicName,
        },
      });
    });

    arr1.reverse();

    this.logger.debug(`arr1: ${JSON.stringify(arr1, null, 4)}`);
    arr1 = arr1.slice((page - 1) * 10, page * 10);

    /*
    this.logger.debug(
      `getPassedTopicList: ${JSON.stringify(getPassedTopicList, null, 4)}`,
    );
    const arr1 = {
      getPassedTopicList: getPassedTopicList,
      getEndTimeList: getEndTimeList,
    };
    this.logger.debug(`arr1: ${JSON.stringify(arr1, null, 4)}`);

    const arr2 = arr1.map((arr1) => {
      return {
        reserveId: arr1.getPassedTopicList.reserveId,
        reserveDate: arr1.getPassedTopicList.reserveDate,
        reserveEndDate: arr1.getEndTimeList,
        topic: {
          topicName: arr1.getPassedTopicList.topic.topicName,
        },
      };
    });
    this.logger.debug(`arr2: ${JSON.stringify(arr2, null, 4)}`);
    */

    // const arr2 = arr1.map((arr) => {
    //   return {
    //     reserveId: arr.getPassedTopicList.reserveId
    //     reserveDate: arr.reserveDate,

    //   };
    // });

    // arr1.push(getPassedTopicList.slice((page - 1) * 10, page * 10));
    // getPassedTopicList = getPassedTopicList.slice((page - 1) * 10, page * 10);

    //console.log('arr1 : ' + JSON.stringify(getPassedTopicList, null, 4)); // test
    // console.log('arr1 : ' + JSON.stringify(arr1, null, 4)); // test

    // [[1,2,3,4,5,6,7,8,9,10],[11]]

    /**
     * /list/page/1
     *
     * 데이터가 1 ~ 25 있다고 쳐봐
     *
     * 1 -> 1 ~ 10
     * 2 -> 11 ~ 20
     * 3 -> 21 ~ 25
     *
     *
     * 2 -> 11 ~ 20
     * x -> (10x-9) ~ 10x
     *
     *
     */

    // res.render('ex_debate_list', { topics: topics });

    const authDto: AuthDto = await this.authService.setAuthDto(req.user.userId);

    res.render('ex_debate_list', {
      arr1: arr1, // test
      ...authDto,
      //getPassedTopicList: getPassedTopicList,
      //getEndTimeList: getEndTimeList,
      //topicReserves: topicReserves,
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
      const topic: TopicDto = await this.topicService.setListTopicDto(
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
