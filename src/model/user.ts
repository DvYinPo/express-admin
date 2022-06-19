import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import Login from './login';
import Project from './project';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20, unique: true })
  name: string;

  @Column('varchar', { length: 50 })
  password: string;

  @Column('varchar', { nullable: true, unique: true, length: 20 })
  email: string;

  @Column('varchar', { nullable: true, unique: true, length: 20 })
  phoneNumber: string;

  @Column('varchar', { default: '/avatar' })
  avatar: string;

  @OneToMany(() => Login, (login) => login.user)
  login: Login[];

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'varchar' })
  createDate: Date;

  @UpdateDateColumn({ type: 'varchar' })
  updateDate: Date;
}

export default User;
