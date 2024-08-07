import { Module } from '@nestjs/common';
import { FeishuGateway } from './feishu.gateway';

@Module({
  providers: [FeishuGateway],
})
export class GatewayModule {}
