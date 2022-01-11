import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    // // User 엔티티 형태를 처리한 레포지토리를 주입
    // @InjectRepository(User)
    // private userRepository: Repository<User>,

    // 커스텀 레포지토리 사용(주입)
    private userRepository: UsersRepository,

    // 커넥션 생성
    private connection: Connection,
  ) {}

  findAll(): Promise<Users[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<Users> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // 트랜잭션 처리방법
  async createMany(users: Users[]) {
    await this.connection.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  async save(user: Users) {
    await this.userRepository.save(user);
  }

  async findUser(platform: string, id: string): Promise<Users> {
    if (platform === 'kakao') {
      const user = await this.userRepository.findByKakaoId(id);
      return user;
    }
  }
}
