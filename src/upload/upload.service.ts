import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';
import { QueryQiniuTokenDto } from './dto/query-qiniu-token.dto';
import { hmacSha1, urlSafeBase64Encode } from 'src/utils';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class UploadService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getQiniuDomains(bucketName: string): Observable<string[]> {
    const url = 'https://uc.qiniuapi.com/v2/domains';
    const params = {
      tbl: bucketName,
    };
    const accessToken = this.getQiniuAccessToken(url, 'get', params);

    return this.httpService
      .get(url, {
        params,
        headers: {
          Authorization: `Qiniu ${accessToken}`,
        },
      })
      .pipe(map((data) => data.data));
  }

  getQiniuAccessToken(urlStr: string, method: string, params?: object) {
    const accessKey = this.configService.get('qiniu.ak');
    const secretKey = this.configService.get('qiniu.sk');

    const url = new URL(urlStr);
    let signingStr = `${method.toUpperCase()} ${url.pathname}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.set(key, value);
      }

      url.search = searchParams.toString();
      signingStr += url.search;
    }

    signingStr += `\nHost: ${url.host}`;

    signingStr += `\n\n`;

    const sign = hmacSha1(signingStr, secretKey, 'base64');
    const encodeSign = urlSafeBase64Encode(sign, 'base64');

    return `${accessKey}:${encodeSign}`;
  }

  getQiniuToken(query: QueryQiniuTokenDto) {
    const { expires, overwrite, key, returnBody } = query;
    const accessKey = this.configService.get('qiniu.ak');
    const secretKey = this.configService.get('qiniu.sk');

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'www-chwech-com',
      expires,
      returnBody,
    };

    // 覆盖的上传凭证
    if (overwrite) {
      options.scope += `:${key}`;
    }

    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  }

  /**
   * 资源管理相关的操作首先要构建BucketManager对象：
   * @date 09/01/2023
   * @return {*}
   * @memberof UploadService
   */
  getBucketManager() {
    const accessKey = this.configService.get('qiniu.ak');
    const secretKey = this.configService.get('qiniu.sk');

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const config = new qiniu.conf.Config({
      zone: qiniu.zone.Zone_z0,
    });

    return new qiniu.rs.BucketManager(mac, config);
  }

  deleteFile(key: string) {
    const bucketManager = this.getBucketManager();

    const bucket = 'www-chwech-com';

    return new Promise((resolve, reject) => {
      bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
        if (err) {
          console.log(err);
          //throw err;
          reject(err);
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
          resolve(respBody);
        }
      });
    });
  }
}
