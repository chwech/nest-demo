import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';
import { FeishuService } from './feishu.service';

@Controller('feishu')
export class FeiShuController {
  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
  ) {}

  @ExcludeResIntercept()
  @Post('test')
  checkSignature(@Body() body) {
    return { challenge: body.challenge };
  }

  // 获取机器人所在的群
  @Get('accessToken')
  async getBotGroupList() {
    return this.feishuService.getBotGroupList();
  }
}
