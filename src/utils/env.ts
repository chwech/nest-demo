// get-dir-all-file-name-arr.ts
import * as fs from 'fs';
import * as path from 'path';

// 默认存放env文件的文件夹路径
const directory = path.resolve(process.cwd(), 'env');

type optionsType = {
  dirPath?: string;
  prefix?: string;
  suffix?: string;
};

/**
 * 返回目录下所有文件的文件名(字符串数组形式)
 * @typedef {Object} options  参数选项
 * @param {string} options.dirPath  目录路径
 * @param {string} options.prefix  给每一个匹配项增加前缀文本
 * @param {string} options.suffix 后缀文本，用于区分环境
 * @return {string[]} 不传参数默认返回/config/env下所有文件拼接的数组
 */
export function getEnvFilePath(options?: optionsType): string[] {
  const params = { dirPath: directory, prefix: 'env/', ...options };
  const results = [];
  try {
    for (const dirContent of fs.readdirSync(params.dirPath)) {
      const dirContentPath = path.resolve(directory, dirContent);
      if (fs.statSync(dirContentPath).isFile()) {
        let filePath = dirContent;
        if (params.prefix) {
          filePath = `${params.prefix}${filePath}`;
        }
        if (params.suffix) {
          if (filePath.endsWith(params.suffix)) {
            results.push(filePath);
          }
        }
      }
    }
    return results;
  } catch (error) {
    return results;
  }
}
