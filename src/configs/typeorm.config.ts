import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mariadb',
  host: '112.151.4.252',
  port: 1026,
  // type: 'mysql',
  // host: 'localhost',
  // port: 3306,
  username: 'debate',
  password: 'mochamocha',
  database: 'debate',
  // 카멜케이스를 스네이크로
  namingStrategy: new SnakeNamingStrategy(),
  // entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  // synchronize: true,
  // dropSchema: true,
  // logging: true,
};
