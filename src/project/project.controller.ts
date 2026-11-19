import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';

import { ProjectService } from './project.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ResponseProjectDto } from './dto/response-project.dto.js';
import { JwtAuthGuard } from '../users/jwt-auth.guard.js';
import { UserId } from '../common/decorators/user-id.decorator.js';

@Controller('projects')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @SerializeOptions({ type: ResponseProjectDto })
  create(@Body() dto: CreateProjectDto, @UserId() userId: string) {
    return this.projectService.create(userId, dto);
  }

  @Get()
  @SerializeOptions({ type: ResponseProjectDto })
  findAll(@UserId() userId: string) {
    return this.projectService.findAll(userId);
  }

  @Get(':id')
  @SerializeOptions({ type: ResponseProjectDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.findOne(userId, id);
  }

  @Patch(':id')
  @SerializeOptions({ type: ResponseProjectDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @UserId() userId: string,
  ) {
    return this.projectService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.remove(userId, id);
  }
}