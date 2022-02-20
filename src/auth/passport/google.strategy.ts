import { Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { GoogleUserDto } from '../dto/google.user.dto';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLINET_ID,
      clientSecret: process.env.GOOGLE_CLINET_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    this.logger.debug(JSON.stringify(profileJson));
    const payload: GoogleUserDto = {
      googleId: profileJson.sub,
      email: profileJson.email,
      profileImage: profileJson.picture,
    };
    done(null, payload);
  }
}
