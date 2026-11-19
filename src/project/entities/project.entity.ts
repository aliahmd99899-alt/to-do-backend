import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Task } from '../../task/entities/task.entity.js';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 100 }) name: string;

  @Column({ default: '#7C3AED' }) color: string;

  @ManyToOne(() => User, (u) => u.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column() userId: string;

  @OneToMany(() => Task, (t) => t.project) tasks: Task[];

  // Populated in ProjectService.findAll(); optional elsewhere.
  tasksCount?: number;

  @CreateDateColumn() createdAt: Date;
}