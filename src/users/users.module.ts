import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  // 由本模块提供并应在其他模块中可用的提供者的子集。
  exports: [UsersService],
})
export class UsersModule {}
