import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 从当前路径处理程序中获取元数据
    const statusText = this.reflector.get('statusText', context.getHandler());
    const isExclude = this.reflector.get(
      'excludeResInterceptor',
      context.getHandler(),
    );

    console.log('before拦截器', statusText);

    return next.handle().pipe(
      map((data) => {
        console.log('after拦截器', data);

        if (isExclude) {
          return data;
        } else {
          return {
            data,
            status: 1,
            msg: statusText || '操作成功',
          };
        }
      }),
    );
  }
}
