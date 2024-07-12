import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wechat } from '../wechat.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs';

@Injectable()
export class WechatCommonService {
  constructor(
    @InjectRepository(Wechat)
    private readonly wechatRepository: Repository<Wechat>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  private async fetchAccessToken() {
    const appid = this.configService.get('wechat.appid');
    const appsecret = this.configService.get('wechat.appsecret');

    const res = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`,
    );
    const wechat = new Wechat();
    wechat.id = 1;
    wechat.accessToken = res.data.access_token;
    // 提前5分钟失效
    wechat.expiresIn = res.data.expires_in - 300;
    wechat.expires = new Date(
      Date.now() + wechat.expiresIn * 1000,
    ).toUTCString();

    this.wechatRepository.save(wechat);

    return wechat.accessToken;
  }

  /**
   * 获取access_token
   * @returns
   */
  async getAccessToken() {
    const wechat = await this.wechatRepository.findOne(1);

    if (wechat) {
      if (new Date(wechat.expires).getTime() > Date.now()) {
        return wechat.accessToken;
      } else {
        return this.fetchAccessToken();
      }
    } else {
      return this.fetchAccessToken();
    }
  }

  /**
   * 获取微信API接口IP地址
   * @returns
   */
  async getApiDomainIp() {
    const accessToken = await this.getAccessToken();
    const url = 'https://api.weixin.qq.com/cgi-bin/get_api_domain_ip';
    return this.httpService
      .get(url, {
        params: {
          access_token: accessToken,
        },
      })
      .pipe(map(({ data }) => data));
  }
}
