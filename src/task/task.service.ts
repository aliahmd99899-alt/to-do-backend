import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import type{ Task } from './entities/task.entity.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTasksDto } from './dto/query-tasks.dto.js';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    // `userId` from the argument wins over anything the client may have sent.
    // completedAt is derived server-side — never accepted from the client.
    const task =  this.taskRepo.create({
      ...dto,
      userId
    });

    return this.taskRepo.save(task);
  }

  async findAll(userId: string, query: QueryTasksDto): Promise<Task[]> {
    const where: FindOptionsWhere<Task> = { userId };
    if (query.done !== undefined) where.done = query.done;
    if (query.archived !== undefined) where.archived = query.archived;
    if (query.category !== undefined) where.category = query.category;
    if (query.projectId !== undefined) where.projectId = query.projectId;

    return this.taskRepo.find({
      where,
      relations: { project: true },
      order: {
        dueDate: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id, userId },
      relations: { project: true },
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    // Transition-only: don't reset completedAt on repeated done=true updates.
    if (dto.done !== undefined && dto.done !== task.done) {
      task.completedAt = dto.done ? new Date() : null;
    }

    // UpdateTaskDto has no completedAt, so Object.assign can't clobber it.
    Object.assign(task, dto);

    return this.taskRepo.save(task);
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    // Delete with ownership baked into the WHERE — one round-trip, no race.
    const result = await this.taskRepo.delete({ id, userId });

    if (!result.affected) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return { message: 'Task deleted successfully' };
  }
}
