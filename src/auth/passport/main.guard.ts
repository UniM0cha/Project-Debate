import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { Observable } from 'rxjs';

export class MainAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(MainAuthGuard.name);

  // 해당 주소로 요청 제어
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  // req.user로 userId가 들어간다.
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err) {
      throw err;
    }
    return user;
  }
}
