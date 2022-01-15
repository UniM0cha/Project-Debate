import { Controller, Get, Render, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionDto } from './dto/session.dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  //사용할 템플릿 지정
  @Render('index')
  root(@Session() session: Record<string, any>) {
    let sessionDto = new SessionDto(session);
    return sessionDto;
  }
}
