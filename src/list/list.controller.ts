import {
  Controller,
  Get,
  Render,
  Res,
  Session,
  Param,
  Logger,
  ParseIntPipe,
  NotFoundException,
  Redirect,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ChatService } from 'src/chat/chat.service';
import { TopicReserve } from 'src/topic/entity/topic-reservation.entity';
import { Topic } from 'src/topic/entity/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(
    private readonly topicServices: TopicService,
    private readonly chatService: ChatService,
    private readonly appService: AppService,
    private readonly listService: ListService,
  ) {}
  private readonly logger = new Logger(ListController.name);

  @Get('/')
  @Redirect('/list/page/1')
  redirectToPageOne() {}

  @Get('/page/:page')
  async getAllTopics(
    @Res() res,
    @Session() session,
    @Param('page', ParseIntPipe) page: number,
  ) {
    // await this.topicServices.addTestData();
    // const topicReserves: TopicReserve[] =
    //   await this.topicServices.findAllTopicReservesWithTopic();
    const topics: Topic[] = await this.topicServices.findAllTopics();
    let getPassedTopicList: TopicReserve[] =
      await this.topicServices.findPASSEDTopicReservesWithTopic();
    // const getPassedTopicList: TopicReserve[] =
    //   await this.topicServices.findPASSEDTopicReservesWithTopic();
    const topicReserveCount: number = await this.topicServices.getPassedCount();
    const topicReservePageCount: number = Math.floor(
      (topicReserveCount - 1) / 10 + 1,
    );

    const getEndTime: TopicReserve[] = await this.topicServices.getPassedList();
    const getEndTimeList: Date[] = getEndTime.map((getEndTime) => {
      getEndTime.startDate.setDate(getEndTime.startDate.getDate() - 1);
      return getEndTime.startDate;
    });

    // const getEndTimeList: Date[] = getEndTime.map((getEndTime) => {
    //   getEndTime.reserveDate.setDate(getEndTime.reserveDate.getDate() - 1);
    //   return getEndTime.reserveDate;
    // });
    getEndTimeList.reverse();

    // getPassedTopicList = getPassedTopicList.slice((page - 1) * 10, page * 10);

    let arr1 = [];

    getPassedTopicList.forEach((element, index) => {
      arr1.push({
        reserveId: element.reserveId,
        startDate: element.startDate,
        endDate: element.endDate,
        topic: {
          topicName: element.topic.topicName,
        },
      });
    });
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

    //return res.render('ex_debate_list', { topics: topics });

    const viewDto = await this.appService.createViewDto(session);

    return res.render('ex_debate_list', {
      arr1: arr1, // test
      ...viewDto,
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
    @Param('id', ParseIntPipe) reserveId: number,
    @Session() session,
    @Res() res,
  ) {
    // reserveId 가 유효한지 확인
    const topicReserve: TopicReserve =
      await this.topicServices.findOnePassedTopicReserve(reserveId);
    if (topicReserve) {
      session.reserveId = reserveId;
      const viewDto = await this.appService.createViewDto(session);
      viewDto.topic = await this.listService.setTopicDto(reserveId);
      this.logger.debug(`viewDto: ${JSON.stringify(viewDto, null, 4)}`);
      return res.render('ex_Debate_show', viewDto);
    } else {
      throw new NotFoundException();
    }
  }
}
