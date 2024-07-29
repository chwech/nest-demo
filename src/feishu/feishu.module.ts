import { Module } from '@nestjs/common';
import { FeiShuController } from './feishu.controller';
import { FeishuService } from './feishu.service';
import { HttpModule } from '@nestjs/axios';
import { Action } from './entities/action.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  // 导入模块的列表，这些模块导出了此模块中所需提供者
  imports: [HttpModule, TypeOrmModule.forFeature([Action])],
  // 控制器
  controllers: [FeiShuController],
  // 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享
  providers: [FeishuService],
})
export class FeiShuModule {}
