import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Timestamp } from 'typeorm';
import User from './user';

@Entity()
export class Login {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column('varchar', { nullable: true })
  mac: string;

  @Column('varchar', { nullable: true })
  ip: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'varchar' })
  createDate: Timestamp;
}

export default Login;
