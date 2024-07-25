import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { AccessToken } from './type';
import { catchError, firstValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FeishuService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async fetchAccessToken() {
    const appid = this.configService.get('feishu.appid');
    const appsecret = this.configService.get('feishu.appsecret');

    const {
      data: { code, msg, tenant_access_token: tenantAccessToken, expire },
    } = await axios.post(
      `https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`,
      {
        app_id: appid,
        app_secret: appsecret,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (code === 0) {
      const accessToken = {
        tenantAccessToken,
        expire: (expire - 300) * 1000 + Date.now(),
      };
      await this.cacheManager.set('tenantAccessToken', accessToken, expire);
      return tenantAccessToken;
    } else {
      return null;
    }
  }

  async getAccessToken() {
    const accessToken = await this.cacheManager.get<AccessToken>(
      'tenantAccessToken',
    );

    if (accessToken) {
      if (new Date(accessToken.expire).getTime() > Date.now()) {
        return accessToken.tenantAccessToken;
      } else {
        return this.fetchAccessToken();
      }
    } else {
      return this.fetchAccessToken();
    }
  }

  async getBotGroupList() {
    const accessToken = await this.getAccessToken();
    const url = 'https://open.feishu.cn/open-apis/im/v1/chats';

    const {
      data: { data },
    } = await firstValueFrom(
      this.httpService
        .get(url, {
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
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
}
