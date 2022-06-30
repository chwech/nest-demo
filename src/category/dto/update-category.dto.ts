import { PartialType } from '@nestjs/mapped-types';
import { IsNumberString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class IdDto {
  @IsNumberString()
  id: number;
}
