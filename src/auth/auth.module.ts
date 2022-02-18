import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './passport/google.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { KakaoStrategy } from './passport/kakao.stategy';
import { NaverStrategy } from './passport/naver.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      // secret: 'hello',
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3200s' },
    }),
    HttpModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    NaverStrategy,
    KakaoStrategy,
    GoogleStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
