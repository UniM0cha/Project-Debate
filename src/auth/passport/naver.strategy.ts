import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { KakaoUserDto } from '../dto/kakao.user.dto';
import { NaverUserDto } from '../dto/naver.user.dto';

export class NaverStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(NaverStrategy.name);
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: process.env.NAVER_REDIRECT,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const payload: NaverUserDto = {
      naverId: profileJson.id,
      email: profileJson.email,
      profileImage: profileJson.profile_image,
    };
    done(null, payload);
  }
}
