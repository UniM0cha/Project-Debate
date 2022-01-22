import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { TopicController } from './topic.controller';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './topic.service';
import { TopicReserveRepository } from './repository/topic-reserve.repository';
import { TopicGateway } from './topic.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicRepository,
      TopicUsersRepository,
      TopicReserveRepository,
    ]),
    UsersModule,
  ],
  controllers: [TopicController],
  providers: [TopicService, TopicGateway],
  exports: [TopicService],
})
export class TopicModule {}
