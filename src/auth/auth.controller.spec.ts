import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UsersRepository } from 'src/users/users.repository';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.development' }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.MYSQL_DB_HOST,
          port: Number.parseInt(process.env.MYSQL_DB_PORT),
          username: process.env.MYSQL_DB_USER,
          password: process.env.MYSQL_DB_PASS,
          database: process.env.MYSQL_DB_NAME,
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
          synchronize: true,
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([UsersRepository]),
        UsersModule,
        HttpModule,
      ],
      providers: [UsersService, AuthService],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
