import { Body, Controller, Post } from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('feishu')
export class FeiShuController {
  constructor(private readonly configService: ConfigService) {}

  @ExcludeResIntercept()
  @Post('test')
  checkSignature(@Body() body) {
    return { challenge: body.challenge };
  }

  // 获取机器人所在的群
  getBotGroupList() {}
}
