import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: number;

  @Column()
  chatId: string;

  @Column()
  buyinNickname: string;

  @Column()
  status: number;

  @Column()
  productIndex: number;

  @Column({ default: 1 })
  num: number;

  @Column({ nullable: true, default: 31 })
  endMinutes: number;

  @Column()
  messageId: string;
}
