import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {length: 20, unique: true})
  name: string;

  @Column('varchar', {length: 50})
  password: string;

  @Column('varchar', {nullable: true, unique: true, length: 20})
  email: string;

  @Column('varchar', {nullable: true, unique: true, length: 20})
  phoneNumber: string;

  @Column('varchar', {default: '/avatar', length: 2000})
  avatar: string;

  @Column('boolean', {default: true})
  isActive: boolean;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

export default User;
