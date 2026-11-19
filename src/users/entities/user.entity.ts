import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Project } from '../../project/entities/project.entity';
import { Task } from '../../task/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 100 }) name: string;

  @Column({ unique: true }) email: string;

  @Column({ select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @OneToMany(() => Project, (p) => p.user) projects: Project[];
  @OneToMany(() => Task, (t) => t.user) tasks: Task[];

  @CreateDateColumn() createdAt: Date;
}