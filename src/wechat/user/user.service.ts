import { Injectable } from '@nestjs/common';
import { WechatCommonService } from '../common/common.service';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class WechatUserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly wechatCommonService: WechatCommonService,
  ) {}

  /**
   * 获取用户列表
   */
  async getUserList(nextOpenId = '') {
    const accessToken = await this.wechatCommonService.getAccessToken();
    const url = `https://api.weixin.qq.com/cgi-bin/user/get`;
    return this.httpService
      .get(url, {
        params: {
          access_token: accessToken,
          next_openid: nextOpenId,
        },
      })
      .pipe(map(({ data }) => data));
  }
}
