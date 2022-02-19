import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { userInfo } from 'os';
import { Observable } from 'rxjs';
import { UserRole } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

export class AdminAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(AdminAuthGuard.name);
  constructor(private readonly usersService: UsersService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(JSON.stringify(user));
    // return super.canActivate(context);
    return true;
  }

  // req.user로 userId가 들어간다.
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err) {
      throw err;
    }
    // if (user && user.userId) {
    //   const userId: string = user.userId;
    //   // const role: UserRole = await this.usersService.findOneById(userId);
    //   this.usersService.findUserRole(userId).then((role: UserRole) => {
    //     if (role === UserRole.ADMIN) {
    //       return user;
    //     } else {
    //       throw new UnauthorizedException();
    //     }
    //   });
    // }
    return user;
  }
}
