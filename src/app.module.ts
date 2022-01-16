import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ListModule } from './list/list.module';
import { typeORMConfig } from 'src/configs/typeorm.config';
import { ChatGateway } from './app.gateway';
import { ChatModule } from './chat/chat.module';
import { TopicModule } from './topic/topic.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    ScheduleModule.forRoot(),
    ListModule,
    UsersModule,
    HttpModule,
    AuthModule,
    ListModule,
    ChatModule,
    TopicModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
