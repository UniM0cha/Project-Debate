import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { TopicController } from './topic.controller';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './topic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicRepository, TopicUsersRepository]),
    UsersModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
