import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [AuthModule, forwardRef(() => AppModule)],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
