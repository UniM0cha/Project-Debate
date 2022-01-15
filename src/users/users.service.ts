import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    // // User 엔티티 형태를 처리한 레포지토리를 주입
    // @InjectRepository(User)
    // private userRepository: Repository<User>,

    // 커스텀 레포지토리 사용(주입)
    private usersRepository: UsersRepository,

    // 커넥션 생성
    private connection: Connection,
  ) {}

  findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<Users> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // 트랜잭션 처리방법
  async createMany(users: Users[]) {
    await this.connection.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }

  async save(user: Users): Promise<Users> {
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findByPlatform(method: string, id: string): Promise<Users> {
    if (method === 'kakao') {
      const user = await this.usersRepository.findByKakaoId(id);
      return user;
    }

    if (method === 'naver') {
      const user = await this.usersRepository.findByNaverId(id);
      return user;
    }

    if (method === 'email') {
      const user = await this.usersRepository.findByEmail(id);
      return user;
    }
  }

  async findByNickname(nickname: string): Promise<Users> {
    const user = await this.usersRepository.findByNickname(nickname);
    return user;
  }

  async updatePlatformId(
    platform: string,
    email: string,
    platformId: string,
  ): Promise<void> {
    switch (platform) {
      case 'kakao':
        await this.usersRepository.updateKakaoId(email, platformId);
        break;

      case 'naver':
        await this.usersRepository.updateNaverId(email, platformId);
        break;

      case 'google':
        await this.usersRepository.updateGoogleId(email, platformId);
        break;
    }
    return;
  }

  async findAllNickname(): Promise<string[]> {
    const users: Users[] = await this.usersRepository.find({
      select: ['nickname'],
    });
    const list = users.map((users) => users.nickname);
    return list;
  }
}
