import { SetMetadata } from '@nestjs/common';

/**
 * 跳过ResponseInterceptor的响应数据处理
 */
export const ExcludeResIntercept = () =>
  SetMetadata('excludeResInterceptor', true);
