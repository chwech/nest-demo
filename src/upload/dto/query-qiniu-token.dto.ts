import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryQiniuTokenDto {
  @IsOptional()
  readonly expires: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value, obj, key }) => {
    if (obj[key] === '0') return false;
    return value;
  })
  readonly overwrite: boolean;

  @IsString()
  @IsOptional()
  readonly key: string;

  @IsString()
  @IsOptional()
  readonly returnBody: string;
}
