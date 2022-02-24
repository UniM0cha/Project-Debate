import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { UserRole } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

/**
 * 아직 테스트중인 가드입니다!!! 적용된 곳 없음!!
 */

@Injectable()
export class WsGuard implements CanActivate {
  private readonly logger = new Logger(WsGuard.name);
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    // const requiredRole: UserRole = this.reflector.getAllAndOverride<UserRole>(
    //   ROLES_KEY,
    //   [context.getHandler(), context.getClass()],
    // );

    // this.logger.debug(`필요한 권한: ${requiredRole}`);
    // if (!requiredRole) {
    //   return true;
    // }

    // AuthGuard('jwt')로부터 받아온 user
    const { user } = context.switchToHttp().getRequest();
    const userId = user.userId;
    const userRole: UserRole = await this.usersService.findUserRole(userId);
    this.logger.debug(`유저의 권한: ${userRole}`);
    return true;
    // return requiredRole === userRole;
  }
}
