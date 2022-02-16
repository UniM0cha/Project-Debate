import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoStrategy } from './strategy/kakao.stategy';

@Module({
  imports: [
    HttpModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
  exports: [AuthService],
})
export class AuthModule {}
