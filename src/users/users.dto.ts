/**
 * DTO（数据传输对象）模式。
 * DTO是一个对象，它定义了如何通过网络发送数据。
 * 我们可以通过使用 TypeScript 接口（Interface）或简单的类（Class）来定义 DTO 模式。
 */

/**
 *
 * @date 14/04/2022
 * @export
 * @class UserDto
 */
export class UserDto {
  readonly username: string;
}
