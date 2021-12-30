import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  //사용할 템플릿 지정
  @Render('index')
  root(){
    return { message: 'Hello world! hihis'};
  }
}
