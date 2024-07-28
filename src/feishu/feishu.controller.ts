import { Body, Controller, Get, Post, Query, Sse, HttpCode } from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';
import { FeishuService } from './feishu.service';
import { Observable, interval, map } from 'rxjs';

@Controller('feishu')
export class FeiShuController {
  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
  ) {}

  @ExcludeResIntercept()
  @Post('test')
  @HttpCode(200)
  checkSignature(@Body() body) {
    const sseEvent = this.feishuService.getSseEvent()
    console.log(body)
    sseEvent.emit('send', body)
    return { challenge: body.challenge };
  }

  // 获取机器人所在的群
  @Get('getBotGroupList')
  async getBotGroupList() {
    return this.feishuService.getBotGroupList();
  }

  @Post('sendText')
  async sendTextMessage(@Body() body) {
    return this.feishuService.sendTextMessage(body.receiveId, body.text);
  }

  @Sse('sse')
  sse(): Observable<any> {
    return new Observable<any>((observer) => {
      const sseEvent = this.feishuService.getSseEvent()
      sseEvent.on('send', (data: any) => {
        observer.next({ data: data });
      });
    });
  }
}
