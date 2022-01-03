import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  //사용할 템플릿 지정
  @Render('index')
  root() {
    return { message: 'Hello world! hihis' };
  }
}
