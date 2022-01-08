import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UsersRepository])],
      controllers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be validate', async () => {
    const user: Users = new Users();
    user.nickname = 'hello';
    user.platform = 'kakao';
    user.kakaoId = '123';
    usersRepository.save(user);

    const validate: boolean = await service.validateUser('kakao', '123');
    expect(validate).toBeTruthy;
  });
});
