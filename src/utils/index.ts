import { createHash, createHmac } from 'crypto';
import * as getRawBody from 'raw-body';
import { Buffer } from 'node:buffer';
/**
 * @param {string} algorithm
 * @param {any} content
 * @return {string}
 */
export const encrypt = (algorithm, content) => {
  const hash = createHash(algorithm);
  hash.update(content);
  return hash.digest('hex');
};

/**
 * sha1加密
 * @param {string} content
 * @return {string}
 */
export const sha1 = (content: string) => encrypt('sha1', content);

/**
 * HMAC-SHA1加密
 * HMAC是哈希运算消息认证码 (Hash-based Message Authentication Code)，HMAC运算利用哈希算法，以一个密钥和一个消息为输入，生成一个消息摘要作为输出。
 * 您可以使用它同时验证数据的完整性和消息的真实性。HMAC-SHA1签名算法是一种常用的签名算法，用于对一段信息进行生成签名摘要。
 */
export const hmacSha1 = (
  content: string,
  key: string,
  encoding: BufferEncoding = 'utf8',
) => createHmac('sha1', key).update(content).digest().toString(encoding);

export const getReqRawBody: (req: any, limit?: string) => Promise<string> = (
  req,
  limit = '1mb',
) => {
  return new Promise((resolve, reject) => {
    getRawBody(
      req,
      {
        length: req.headers['content-length'],
        limit,
        encoding: true,
      },
      (err, string) => {
        if (err) {
          return reject(err);
        }

        resolve(string);
      },
    );
  });
};

/*
 * URL安全的Base64编码
 * URL安全的Base64编码适用于以URL方式传递Base64编码结果的场景。该编码方式的基本过程是先将内容以Base64格式编码为字符串，然后检查该结果字符串，
 * 将字符串中的加号+换成中划线-，并且将斜杠/换成下划线_。
 */
export const urlSafeBase64Encode = (
  content = '',
  encoding: BufferEncoding = 'utf8',
) => {
  return Buffer.from(content, encoding)
    .toString('base64')
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_'); // Convert '/' to '_'
  // .replace(/=+$/, ''); // Remove ending '='
};
