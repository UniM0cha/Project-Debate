import { Injectable, Logger } from '@nestjs/common';
import { UserRole, Users } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(AdminService.name);

  async checkAdmin(session: Record<string, any>): Promise<boolean> {
    const userId: string = session.userData.userId;
    if (!userId) {
      return false;
    }

    const users: Users = await this.usersService.findOneById(userId);
    if (users.role !== UserRole.ADMIN) {
      return false;
    } else {
      return true;
    }
  }
}
