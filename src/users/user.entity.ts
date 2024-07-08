import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ type: 'text' })
  password: string;

  @Column()
  iv: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
