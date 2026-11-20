import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm'; // استيراد Relation كنوع فقط
import { User } from '../../users/entities/user.entity';
import { Task } from '../../task/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ length: 100 }) name: string;

  @Column({ default: '#7C3AED' }) color: string;

  @ManyToOne(() => User, (u) => u.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Relation<User>; // 2. تم تغليف User بـ Relation

  @Column() userId: string;

  @OneToMany(() => Task, (t) => t.project) 
  tasks: Relation<Task[]>; // 3. تم تغليف Task بـ Relation

  // Populated in ProjectService.findAll(); optional elsewhere.
  tasksCount?: number;

  @CreateDateColumn() createdAt: Date;
}