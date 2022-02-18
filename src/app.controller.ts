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
import { ViewDto, ViewTopicDto } from './dto/view.dto';
import { TopicDataDto } from './topic/dto/topic.dto';
import { TopicService } from './topic/topic.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private topicService: TopicService,
    private authService: AuthService,
  ) {}
  private readonly logger = new Logger(AppController.name);

  @Get('/')
  @Render('index')
  @UseGuards(AuthGuard('jwt'))
  async root(@Session() session, @Req() req) {
    session.reserveId = await this.topicService.getCurrentReserveId();

    const authDto: AuthDto = await this.authService.setAuthDto(session);

    const hasOpinion = await this.topicService.checkHasOpinion(authDto.userId);
    const topicDataDto: TopicDataDto =
      await this.topicService.setTopicDataDto();

    const data = { ...authDto, hasOpinion, topic: topicDataDto };
    this.logger.debug(`req.user: ${JSON.stringify(req.user)}`);
    this.logger.debug(`send view data: ${JSON.stringify(data)}`);
    return data;
  }

  @Post('/time')
  sendTime() {}

  @Get('/test')
  @Render('test')
  test() {}
}
