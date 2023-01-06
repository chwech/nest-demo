import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryQiniuTokenDto {
  @IsOptional()
  readonly expires: number;

  @IsOptional()
  readonly overwrite: boolean;

  @IsString()
  @IsOptional()
  readonly key: string;

  @IsString()
  @IsOptional()
  readonly returnBody: string;
}
