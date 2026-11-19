import { Expose } from 'class-transformer';
import { TaskCategory } from '../enums/task-category.enum.js';

export class ResponseTaskDto {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() projectId: string | null;
  @Expose() category: TaskCategory;
  @Expose() dueDate: string | null;
  @Expose() done: boolean;
  @Expose() archived: boolean;
  @Expose() completedAt: Date | null;
  @Expose() userId: string;
  @Expose() createdAt: Date;
  @Expose() updatedAt: Date;
}