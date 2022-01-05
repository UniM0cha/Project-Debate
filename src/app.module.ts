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
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    // mysql config
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: Number.parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USER,
      password: process.env.MYSQL_DB_PASS,
      database: process.env.MYSQL_DB_NAME,
      // entities: [User],
      // 이 옵션은 forFeature() 메소드를 통해 등록된 모든 엔티티가 자동 추가된다.
      autoLoadEntities: true,

      // Setting synchronize makes sure your entities will be synced with the database, every time you run the application.
      synchronize: true,
      dropSchema: true,
    }),
    UsersModule,
    LoginModule,
    HttpModule,
    AuthModule,
  ],
  controllers: [AppController, LoginController],
  providers: [AppService, LoginService],
})
export class AppModule {}
