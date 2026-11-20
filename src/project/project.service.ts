import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type{ Project } from './entities/project.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
  ) {}

  async create(userId: string, dto: CreateProjectDto): Promise<Project> {
    const existing = await this.projectRepo.findOne({
      where: { userId, name: dto.name },
    });
    if (existing) {
      throw new ConflictException(
        `You already have a project named "${dto.name}"`,
      );
    }

    // `userId` from the argument wins over anything the client sent.
    const project = this.projectRepo.create({ ...dto, userId });
    return this.projectRepo.save(project);
  }

  async findAll(userId: string): Promise<Project[]> {
    const projects = await this.projectRepo.find({
      where: { userId },
      relations: { tasks: true },
      order: { createdAt: 'DESC' },
    });
    return projects.map((project) => {
      project.tasksCount = project.tasks.length;
      return project;
    });
  }

  async findOne(userId: string, id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id, userId },
      relations: { tasks: true },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id, userId } });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    // Re-check duplicate name only if the name is actually changing.
    if (dto.name !== undefined && dto.name !== project.name) {
      const clash = await this.projectRepo.findOne({
        where: { userId, name: dto.name },
      });
      if (clash) {
        throw new ConflictException(
          `You already have a project named "${dto.name}"`,
        );
      }
    }

    Object.assign(project, dto);
    return this.projectRepo.save(project);
  }

  async remove(userId: string, id: string): Promise<{ message: string }> {
    // Delete with ownership baked into WHERE — one round-trip, no race.
    // Task.projectId is set to NULL automatically by the FK (onDelete: 'SET NULL').
    const result = await this.projectRepo.delete({ id, userId });

    if (!result.affected) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return { message: 'Project deleted successfully' };
  }
}