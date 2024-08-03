import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as lark from '@larksuiteoapi/node-sdk';
import { EventEmitter } from 'node:events';
import { Action } from './entities/action.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Config } from './entities/config.entity';

@Injectable()
export class FeishuService {
  appid: string;
  appsecret: string;
  client: lark.Client;
  private sseEvent = new EventEmitter();

  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(Config)
    private configRepository: Repository<Config>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.appid = this.configService.get('feishu.appid');
    this.appsecret = this.configService.get('feishu.appsecret');
    const client = new lark.Client({
      appId: this.appid,
      appSecret: this.appsecret,
      appType: lark.AppType.SelfBuild,
      domain: lark.Domain.Feishu,
    });

    this.client = client;
  }

  async getAccessToken() {
    const res = (await this.client.auth.tenantAccessToken.internal({
      data: {
        app_id: this.appid,
        app_secret: this.appsecret,
      },
    })) as { tenant_access_token: string };
    return res.tenant_access_token;
  }

  async getBotGroupList() {
    const list = [];
    for await (const item of await this.client.im.chat.listWithIterator({})) {
      list.push(...item.items);
    }
    return list;
  }

  async sendTextMessage(receiveId, text) {
    const accessToken = await this.getAccessToken();
    const url = 'https://open.feishu.cn/open-apis/im/v1/messages';

    const {
      data: { data },
    } = await firstValueFrom(
      this.httpService
        .post(
          url,
          {
            receive_id: receiveId,
            msg_type: 'text',
            content: JSON.stringify({ text }),
          },
          {
            headers: {
              Authorization: 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
            },
            params: {
              receive_id_type: 'chat_id',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            // this.logger.error(error.response.data);
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  getSseEvent() {
    return this.sseEvent;
  }

  saveAction(action: Action) {
    return this.actionRepository.save(action);
  }

  getAction(chatId) {
    this.logger.log('打印日志');
    this.logger.error('错误日志');
    return this.actionRepository.findOne({
      where: {
        chatId,
        status: 0,
      },
    })
  }

  async saveConfig(data: Config) {
    const config = await this.configRepository.findOne({ deviceId: data.deviceId });
    return this.configRepository.save({ ...config, ...data })
  }
}
