import { IsInt, IsPositive } from 'class-validator';

export class QueryArticleDto {
  @IsPositive()
  @IsInt()
  readonly page: number;

  @IsPositive()
  @IsInt()
  readonly per_page: number;
}
