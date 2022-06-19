import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import User from './user';
import Project from './project';
import Issue from './issue';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  content: string;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Project, (project) => project.id, {
    nullable: true,
  })
  project: Project;

  @ManyToOne(() => Issue, (issue) => issue.id, {
    nullable: true,
  })
  issue: Issue;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'varchar' })
  createDate: Date;

  @UpdateDateColumn({ type: 'varchar' })
  updateDate: Date;
}

export default Comment;
