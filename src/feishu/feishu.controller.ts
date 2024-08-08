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
  CACHE_MANAGER,
} from '@nestjs/common';
import { ExcludeResIntercept } from 'src/lib/exclude.response.intercept.decorator';
import { ConfigService } from '@nestjs/config';
import { FeishuService } from './feishu.service';
import { Observable } from 'rxjs';
import { Action } from './entities/action.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Public } from 'src/lib/public';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Cache } from 'cache-manager'

@Controller('feishu')
export class FeiShuController {
  constructor(
    private readonly feishuService: FeishuService,
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private schedulerRegistry: SchedulerRegistry,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
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

          this.logger.log(action, FeiShuController.name);

          if (
            !action.type ||
            !action.productIndex ||
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

  @Public()
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
  async getAction(@Query() query, @Request() req) {
    const sseEvent = this.feishuService.getSseEvent();
    try {
      this.schedulerRegistry.deleteTimeout(req.user.userId)
    } catch (error) {
      this.logger.error(error.message, error.stack)
    }
    sseEvent.emit('send', { userId: req.user.userId, connect_status: 1 })
    const connectStatus = await this.cacheManager.get('connectStatus');
    if (!connectStatus) {
      await this.cacheManager.set('connectStatus', {
        [req.user.userId]: 1
      }, { ttl: 0 });
    } else {
      connectStatus[req.user.userId] = 1
      await this.cacheManager.set('connectStatus', connectStatus, { ttl: 0 });
    }

    const callback = () => {
      try {
        sseEvent.emit('send', { userId: req.user.userId, connect_status: 0 })
        connectStatus[req.user.userId] = 0
        this.cacheManager.set('connectStatus', connectStatus, { ttl: 0 });
        query.chatId && this.feishuService.sendTextMessage(query.chatId, `账号${query.buyinNickname}已离线`) 
        this.logger.warn(`Timeout ${req.user.userId} executing after (13s)!`);
      } catch (error) {
        this.logger.error(error.message, error.stack)
      }
    }
  
    const timeout = setTimeout(callback, 13000);
    this.schedulerRegistry.addTimeout(req.user.userId, timeout);

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
