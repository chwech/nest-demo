import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Wechat实体
 * @date 07/04/2022
 * @export
 * @class Wechat
 */
@Entity()
export class Wechat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;

  @Column()
  expiresIn: number;

  @Column('timestamp')
  expires: string;
}
