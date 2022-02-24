import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

const fromAuthCookie = function () {
  return function (request) {
    let token = null;
    if (request && request.cookies) {
      token = request.cookies['access_token'];
    }
    return token;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor() {
    super({
      jwtFromRequest: fromAuthCookie(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId };
  }
}
