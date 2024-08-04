import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { EncrytHelper } from 'src/utils/helper';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],

  providers: [UsersService, EncrytHelper],
  // 由本模块提供并应在其他模块中可用的提供者的子集。
  exports: [UsersService],

  controllers: [UserController]
})
export class UsersModule {}
