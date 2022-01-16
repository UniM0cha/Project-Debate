import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { Topic } from './entity/topic.entity';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  private readonly logger = new Logger(TopicController.name);

  @Post('new')
  async createNewTopic(@Body() body, @Res() res) {
    const password = body.password;

    if (password === '456789') {
      const topic = body.topic;
      const start = new Date(Date.parse(body.start));

      await this.topicService.createNewTopic(topic, start);
      return res.redirect('/admin');
    }

    //
    else {
      return res.redirect('/');
    }
  }
}
