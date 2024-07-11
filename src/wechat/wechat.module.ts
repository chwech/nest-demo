import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WechatController } from './wechat.controller';
import { Wechat } from './wechat.entity';
import { WechatService } from './wechat.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  // 导入模块的列表，这些模块导出了此模块中所需提供者
  imports: [TypeOrmModule.forFeature([Wechat]), HttpModule],
  // 控制器
  controllers: [WechatController],
  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  providers: [WechatService],
})
export class WechatModule {}
