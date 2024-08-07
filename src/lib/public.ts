import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = '__isPublicRoute';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
