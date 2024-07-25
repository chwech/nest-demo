import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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

  @Get('sendText')
  async sendTextMessage(@Query() query) {
    return this.feishuService.sendTextMessage(query.receiveId, query.text);
  }
}
