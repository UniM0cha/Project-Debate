import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver';
import { KakaoUserDto } from '../dto/kakao.user.dto';

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
    this.logger.debug(JSON.stringify(profile));
    // const kakao_account = profileJson.kakao_account;
    // const payload: KakaoUserDto = {
    //   kakaoId: profileJson.id,
    //   email: kakao_account.email,
    //   profileImage: kakao_account.profile.thumbnail_image_url,
    // };
    // done(null, payload);
  }
}
