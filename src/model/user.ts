import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Generated()
  id: number;

  @Column({length: 20})
  firstName: string;

  @Column({nullable: true, length: 20})
  lastName: string;

  @Column({length: 20})
  password: string;

  @Column({nullable: true})
  email: string;

  @Column({nullable: true})
  phoneNumber: string;

  @Column({default: true})
  isActive: boolean;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}

export default User;
