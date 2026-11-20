import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  Relation, // 1. قمنا بإضافة هذا الاستيراد
} from 'typeorm';
import { Project } from '../../project/entities/project.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { TaskCategory } from '../enums/task-category.enum.js';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 200 }) title: string;

  @Column({ type: 'enum', enum: TaskCategory, default: TaskCategory.WORK })
  category: TaskCategory;

  @Column({ type: 'date', nullable: true }) dueDate: string | null;

  @Column({ default: false }) done: boolean;

  @Column({ default: false }) archived: boolean;

  @Column({ type: 'timestamptz', nullable: true }) completedAt: Date | null;

  @ManyToOne(() => Project, (p) => p.tasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'projectId' })
  project: Relation<Project> | null; // 2. تم تغليف Project بـ Relation

  @Column({ nullable: true }) projectId: string | null;

  @ManyToOne(() => User, (u) => u.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>; // 3. تم تغليف User بـ Relation

  @Index() @Column() userId: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}