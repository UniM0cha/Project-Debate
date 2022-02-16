import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';

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
    this.logger.debug(`kakao_account: ${JSON.stringify(kakao_account)}`);
  }
}
