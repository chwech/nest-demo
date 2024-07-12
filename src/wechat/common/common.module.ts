import { Module } from '@nestjs/common';
import { WechatCommonService } from './common.service';
import { Wechat } from '../wechat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

@Module({
  exports: [WechatCommonService],
  providers: [WechatCommonService],
  imports: [TypeOrmModule.forFeature([Wechat]), HttpModule],
})
export class WechatCommonModule {}
