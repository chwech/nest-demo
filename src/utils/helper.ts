import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncrytHelper {
  salt: string;
  password: string;

  constructor(private readonly configService: ConfigService) {
    // 生成随机盐值
    this.salt = this.configService.get('aes.salt');
    // 加密密码
    this.password = this.configService.get('aes.password');
  }

  async encryt(text) {
    // 初始化向量
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      this.password,
      this.salt,
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);
    return {
      iv: iv.toString('hex'),
      encrytText: Buffer.concat([cipher.update(text), cipher.final()]).toString(
        'hex',
      ),
    };
  }

  async decrypt(encryptedText, iv) {
    const key = (await promisify(scrypt)(
      this.password,
      this.salt,
      32,
    )) as Buffer;
    const decipher = createDecipheriv(
      'aes-256-ctr',
      key,
      Buffer.from(iv, 'hex'),
    );
    const decryptedText = Buffer.concat([
      decipher.update(encryptedText, 'hex'),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }
}
