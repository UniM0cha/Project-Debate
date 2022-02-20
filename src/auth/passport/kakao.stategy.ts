import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { KakaoUserDto } from '../dto/kakao.user.dto';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(KakaoStrategy.name);
  constructor() {
    super({
      clientID: process.env.KAKAO_CLINET_ID,
      clientSecret: process.env.KAKAO_CLINET_SECRET,
      callbackURL: process.env.KAKAO_REDIRECT,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    const payload: KakaoUserDto = {
      kakaoId: profileJson.id,
      email: kakao_account.email,
      profileImage: kakao_account.profile.thumbnail_image_url,
    };
    done(null, payload);
  }
}
