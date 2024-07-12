import { Module } from '@nestjs/common';
import { WechatUserService } from './user.service';
import { WechatCommonModule } from '../common/common.module';
import { HttpModule } from '@nestjs/axios';
import { WechatUserController } from './user.controller';

@Module({
  controllers: [WechatUserController],
  exports: [WechatUserService, WechatCommonModule],
  providers: [WechatUserService],
  imports: [WechatCommonModule, HttpModule],
})
export class WechatUserModule {}
