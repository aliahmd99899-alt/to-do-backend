import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../users/jwt-auth.guard.js';

import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ResponseUserDto } from './dto/response-user.dto.js';
import {LoginDto} from './dto/login.dto.js'
import type {JwtUser} from "../type/RequestJwtType"

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SerializeOptions({ type: ResponseUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
  @Post("login")
  @SerializeOptions({ type: ResponseUserDto })
  login(@Body() dto: LoginDto) {
    return this.usersService.login(dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch()
  @SerializeOptions({ type: ResponseUserDto })
  update(@Request() req:JwtUser, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Request() req:JwtUser) {
    return this.usersService.remove(req.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @SerializeOptions({ type: ResponseUserDto })
  getProfile(@Request() req:JwtUser) {
    return this.usersService.findOne(req.userId);
  }
}