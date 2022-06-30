import { IsNotEmpty } from 'class-validator';

/**
 * DTO模式
 * DTO是一个对象，它定义了如何通过网络发送数据。可以用接口或类定义DTO模式，推荐使用类
 * 可以在这里用class-validator验证数据
 * @date 07/06/2022
 * @export
 * @class CreateCategoryDto
 */
export class CreateCategoryDto {
  @IsNotEmpty()
  readonly name: string;
}
