import { createHash } from 'crypto';
import * as getRawBody from 'raw-body';

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
 * @param {any} content
 * @return {string}
 */
export const sha1 = (content) => encrypt('sha1', content);

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
