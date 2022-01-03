import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';
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

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  // 트랜잭션 처리방법
  async createMany(users: User[]) {
    await this.connection.transaction(async (manager) => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });
  }
}
