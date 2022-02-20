import { ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// 로그인되지 않았더라도 접근은 할 수 있도록 해줌.
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
