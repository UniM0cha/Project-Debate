import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ListModule } from './list/list.module';
import { ChatGateway } from './app.gateway';
import { ChatModule } from './chat/chat.module';
import { TopicModule } from './topic/topic.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminModule } from './admin/admin.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
      logging: true,
    }),
    ScheduleModule.forRoot(),
    ListModule,
    UsersModule,
    HttpModule,
    AuthModule,
    ListModule,
    ChatModule,
    TopicModule,
    AdminModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
  exports: [AppService],
})
export class AppModule {}
