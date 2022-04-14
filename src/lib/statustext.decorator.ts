import { SetMetadata } from '@nestjs/common';

export const StatusText = (statusText: string) =>
  SetMetadata('statusText', statusText);
