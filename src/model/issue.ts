import { userInfo } from 'os';
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
import Project from './project';
import Comment from './comment';
import User from './user';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('varchar', { nullable: true, length: 20 })
  category: string;

  @Column('varchar', { default: '/project/url' })
  url: string;

  @Column('varchar', { default: 'COMMON' }) // emergency hight medium common low negligible
  priority: string;

  @Column('varchar', { default: 'BACKLOG' }) // backlog progressing check done
  status: string;

  @Column('int', { nullable: true })
  estimate: number;

  @Column('int', { nullable: true })
  timeSpent: number;

  @ManyToMany(() => User)
  @JoinTable()
  assignee: User[];

  @ManyToOne(() => User, (user) => user.id)
  reporter: User;

  @ManyToOne(() => Project, (project) => project.id)
  project: Project;

  @OneToMany(() => Comment, (comment) => comment.issue)
  comment: Comment;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'varchar' })
  createDate: Date;

  @UpdateDateColumn({ type: 'varchar' })
  updateDate: Date;
}

export default Issue;
