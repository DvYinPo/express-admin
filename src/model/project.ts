import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import User from './user';
import Comment from './comment';
import Issue from './issue';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column('varchar')
  description: string;

  @Column('varchar', { nullable: true })
  category: string;

  @Column('varchar', { default: '/project/issue/url' })
  url: string;

  @Column('varchar', { default: '/project_logo.png' })
  logo: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Issue, (issue) => issue.project)
  issue: Issue[];

  @OneToMany(() => Comment, (comment) => comment.project)
  comment: Comment;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'varchar' })
  createDate: Date;

  @UpdateDateColumn({ type: 'varchar' })
  updateDate: Date;
}

export default Project;
