import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    JwtModule.register({ secret: '39YOyIrzGkQ9DfNounmju_Pvtc6o' }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
