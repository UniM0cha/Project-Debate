import {
  Controller,
  Get,
  Logger,
  Post,
  Render,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthDto } from './auth/dto/auth.dto';
import { MainAuthGuard } from './auth/passport/main.guard';
import { ViewDto, ViewTopicDto } from './dto/view.dto';
import { TopicDataDto } from './topic/dto/topic.dto';
import { TopicService } from './topic/topic.service';

@Controller()
export class AppController {
  constructor(
    private topicService: TopicService,
    private authService: AuthService,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/')
  @Render('index')
  @UseGuards(MainAuthGuard)
  async root(@Session() session, @Req() req) {
    this.logger.debug(`JWT Payload: ${JSON.stringify(req.user)}`);

    session.reserveId = await this.topicService.getCurrentReserveId();

    const authDto: AuthDto = await this.authService.setAuthDto(req.user.userId);
    const hasOpinion: boolean = await this.topicService.checkHasOpinion(
      req.user.userId,
    );

    const topicDataDto: TopicDataDto =
      await this.topicService.setTopicDataDto();

    const data = { ...authDto, hasOpinion, topic: topicDataDto };
    this.logger.debug(`send view data: ${JSON.stringify(data)}`);
    return data;
  }

  @Post('/time')
  sendTime() {}

  @Get('/test')
  @Render('test')
  test() {}
}
