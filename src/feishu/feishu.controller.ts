import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Sse,
  HttpCode,
  Request,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';
import { FeishuService } from './feishu.service';
import { Observable } from 'rxjs';
import { Action } from './entities/action.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Public } from 'src/lib/public';

@Controller('feishu')
export class FeiShuController {
  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  @Public()
  @ExcludeResIntercept()
  @Post('test')
  @HttpCode(200)
  async checkSignature(@Body() body) {
    const sseEvent = this.feishuService.getSseEvent();
    this.logger.log(body);

    if (body?.header?.event_type === 'im.message.receive_v1') {
      const {
        event: {
          message: {
            message_id: messageId,
            message_type: messageType,
            content,
            chat_id: chatId,
          },
        },
      } = body;

      if (messageType === 'text') {
        const typeMap = {
          补券: 1,
          建券: 2,
        };

        const actionParams = JSON.parse(content).text.split(' ')[1].split('-');
        const type = actionParams[0];

        if (typeMap[type]) {
          const buyinNickname = actionParams[1];
          const action = new Action();
          action.status = 0;
          action.type = typeMap[type];
          action.productIndex = actionParams[2];
          action.num = actionParams[3];
          action.endMinutes = actionParams[4];
          action.buyinNickname = buyinNickname;
          action.chatId = chatId;
          action.messageId = messageId;

          this.logger.log(action);

          if (
            !action.type ||
            !action.productIndex ||
            !action.num ||
            !action.buyinNickname
          ) {
            this.feishuService.sendTextMessage(chatId, '指令格式错误');
          } else {
            this.feishuService.saveAction(action);
          }
        } else {
          this.feishuService.sendTextMessage(chatId, '指令格式错误');
        }
      }
    }
    sseEvent.emit('send', body);
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
      const sseEvent = this.feishuService.getSseEvent();
      sseEvent.on('send', (data: any) => {
        observer.next({ data: data });
      });
    });
  }

  @Get('getAction')
  async getAction(@Query() query) {
    const chatId = query.chatId;
    const buyinNickname = query.buyinNickname;
    const action = await this.feishuService.getAction(chatId, buyinNickname);
    return action;
  }

  @Post('updateActionStatus')
  async updateActionStatus(@Body() body) {
    return this.feishuService.saveAction(body);
  }

  @Post('config')
  async saveConfig(@Body() body, @Request() req) {
    const data = { ...body, userId: req.user.userId };
    return this.feishuService.saveConfig(data);
  }
}
