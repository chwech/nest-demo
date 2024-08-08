import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
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
      this.logger.log(item);
      if (Array.isArray(item.items)) {
        list.push(...item.items);
      }
    }
    return list;
  }

  async sendTextMessage(receiveId, text) {
    return this.client.im.message.create({
      params: {
        receive_id_type: 'chat_id'
      },
      data: {
        receive_id: receiveId,
        msg_type: 'text',
        content: JSON.stringify({ text }),
      },
    })
  }

  getSseEvent() {
    return this.sseEvent;
  }

  async saveAction(action: Action) {
    const existAction = await this.findOneAction({
      messageId: action.messageId,
    });
    if (!existAction) {
      return this.actionRepository.create(action);
    } else {
      return this.actionRepository.save(action);
    }
  }

  findOneAction(where) {
    return this.actionRepository.findOne({ where });
  }

  getAction(chatId, buyinNickname) {
    return this.actionRepository.findOne({
      where: {
        chatId,
        buyinNickname,
        status: 0,
      },
    });
  }

  async saveConfig(data: Config) {
    const config = await this.getConfig({
      buyinAccountId: data.buyinAccountId,
    });
    return this.configRepository.save({ ...config, ...data });
  }

  async getConfig(options) {
    return this.configRepository.findOne(options);
  }
}
