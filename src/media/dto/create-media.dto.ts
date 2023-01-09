import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMediaDto {
  @IsNotEmpty()
  readonly hash: string;

  @IsNotEmpty()
  readonly url: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly mimeType: string;

  @IsNotEmpty()
  readonly width: number;

  @IsNotEmpty()
  readonly height: number;

  @IsOptional()
  readonly title: string;

  @IsOptional()
  readonly alt: string;

  @IsOptional()
  readonly description: string;
}
