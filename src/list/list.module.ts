import { Module } from '@nestjs/common';
import { ListController } from './list.controller';

@Module({
  controllers: [ListController],
})
export class ListModule {}
