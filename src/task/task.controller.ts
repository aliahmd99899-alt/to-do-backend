import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  HttpCode,
} from '@nestjs/common';

import { JwtAuthGuard } from '../users/jwt-auth.guard.js';
import { TaskService } from './task.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { QueryTasksDto } from './dto/query-tasks.dto.js';
import { ResponseTaskDto } from './dto/response-task.dto.js';
import { UserId } from '../common/decorators/user-id.decorator.js';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @SerializeOptions({ type: ResponseTaskDto })
  create(@Body() dto: CreateTaskDto, @UserId() userId: string) {
    return this.taskService.create(userId, dto);
  }

  @Get()
  @SerializeOptions({ type: ResponseTaskDto })
  findAll(@Query() query: QueryTasksDto, @UserId() userId: string) {
    return this.taskService.findAll(userId, query);
  }

  @Get(':id')
  @SerializeOptions({ type: ResponseTaskDto })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.taskService.findOne(userId, id);
  }

  @Patch(':id')
  @SerializeOptions({ type: ResponseTaskDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @UserId() userId: string,
  ) {
    return this.taskService.update(userId, id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.taskService.remove(userId, id);
  }
}