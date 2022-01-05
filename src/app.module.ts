import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.entity';
import { LoginController } from './login/login.controller';
import { LoginModule } from './login/login.module';
import { HttpModule } from '@nestjs/axios';
import { LoginService } from './login/login.service';

@Module({
  imports: [
    // mysql config
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'debate',
      password: 'mochamocha',
      database: 'debate',
      // entities: [User],
      // 이 옵션은 forFeature() 메소드를 통해 등록된 모든 엔티티가 자동 추가된다.
      autoLoadEntities: true,

      // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
      // synchronize: true,
    }),
    UsersModule,
    LoginModule,
    HttpModule,
  ],
  controllers: [AppController, LoginController],
  providers: [AppService, LoginService],
})
export class AppModule {}
