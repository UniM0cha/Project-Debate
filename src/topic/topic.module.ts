import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { TopicUsersRepository } from './repository/topic-users.repository';
import { TopicController } from './topic.controller';
import { TopicRepository } from './repository/topic.repository';
import { TopicService } from './topic.service';
import { TopicCycleRepository } from './repository/topic-cycle.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TopicRepository,
      TopicUsersRepository,
      TopicCycleRepository,
    ]),
    UsersModule,
  ],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
