import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

/**
 * 管道是@Injectable() 装饰器的类。管道应实现 PipeTransform 接口。
 * 类型：
 * 验证管道
 * @date 06/06/2022
 * @export
 * @class ValidatePipe
 * @implements {PipeTransform}
 */
@Injectable()
export class ValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('管道', value, metadata);
    return value;
  }
}
