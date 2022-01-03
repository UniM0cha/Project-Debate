import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getCustomRepository } from 'typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  // const usersRepository = getCustomRepository(UsersRepository);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be save one user', () => {
    const user = new Users();
    user.firstName = 'lee';
    user.lastName = 'yoon';
    user.isActive = true;
    service.save(user);
  });
});
