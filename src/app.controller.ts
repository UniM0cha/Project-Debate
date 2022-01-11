import { Controller, Get, Render, Session } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/')
  //사용할 템플릿 지정
  @Render('index')
  root(@Session() session: Record<string, any>) {
    if (session.isLogined) {
      return {
        isLogined: true,
        id: session.authData.id,
        doesWhat: 'hi',
      };
    } else {
      return { isLogined: false };
    }
    // return {
    //   message: 'Hello world! hihis',
    // };
  }
}
