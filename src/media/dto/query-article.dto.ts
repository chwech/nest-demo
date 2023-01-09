import { IsInt, IsPositive } from 'class-validator';

export class QueryMediaDto {
  @IsPositive()
  @IsInt()
  readonly page: number = 1;

  @IsPositive()
  @IsInt()
  readonly per_page: number = 10;
}
