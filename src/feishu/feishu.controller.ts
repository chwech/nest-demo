import { Body, Controller, Get, Post, Query, Sse, HttpCode, UseGuards,   Request, } from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';
import { FeishuService } from './feishu.service';
import { Observable, interval, map } from 'rxjs';
import { Action } from './entities/action.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

    if (body.header.event_type === 'im.message.receive_v1') {
      const {
        event: {
          message: {
            message_type: messageType,
            content,
            chat_id: chatId,
            create_time: createTime
          }
        }
      } = body

      if (messageType === 'text') {
        const typeMap = {
          '补券': 1,
          '建券': 2
        }

        const actionParams = JSON.parse(content).text.split(' ')[1].split('-')
        const type = actionParams[0]

        if(type) {

          const action = new Action()
          action.chatId = chatId
          action.status = 0
          action.type = typeMap[type]
          action.productIndex = actionParams[1]
          action.num = actionParams[2]
          action.endMinutes = actionParams[3]

          this.feishuService.saveAction(action)
        }


      }

    }
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


  @Get('getAction')
  async  getAction(@Query('chatId') chatId) {
    const action = await this.feishuService.getAction(chatId)

    if (action) {
      action.status = 1
      await this.feishuService.saveAction(action)
    }

    return action
  }

  @UseGuards(JwtAuthGuard)
  @Post('config')
  async saveConfig(@Body() body, @Request() req) {
    const data = { ...body, userId: req.user.userId  }
    return this.feishuService.saveConfig(data)
  }
}
