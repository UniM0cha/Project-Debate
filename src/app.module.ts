import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ListModule } from './list/list.module';
import { typeORMConfig } from 'src/configs/typeorm.config';

@Module({
  imports: [
    // mysql config
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    HttpModule,
    AuthModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
