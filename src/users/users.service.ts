import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 10;

type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    dto: CreateUserDto,
  ): Promise<{ user: PublicUser; access_token: string }> {
    const email = dto.email.trim().toLowerCase();

    const clash = await this.usersRepo.findOne({ where: { email } });
    if (clash) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = this.usersRepo.create({
      name: dto.name.trim(),
      email,
      password: hashedPassword,
    });

    const saved = await this.usersRepo.save(user);

    const access_token = await this.jwtService.signAsync({
      sub: saved.id,
      email: saved.email,
    });

    return { user: this.withoutPassword(saved), access_token };
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async login(
    dto: LoginDto,
  ): Promise<{ user: PublicUser; access_token: string }> {
    const user = await this.usersRepo.findOne({
      where: { email: dto.email.trim().toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
      },
    });

    // نفس الرسالة للحالتين حتى لا نكشف هل الإيميل موجود
    const isValid = user && (await bcrypt.compare(dto.password, user.password));
    if (!user || !isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { user: this.withoutPassword(user), access_token };
  }

  async update(id: string, dto: UpdateUserDto): Promise<PublicUser> {
    const user = await this.usersRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    if (dto.name !== undefined) {
      user.name = dto.name.trim();
    }

    if (dto.email !== undefined) {
      const email = dto.email.trim().toLowerCase();
      if (email !== user.email) {
        const clash = await this.usersRepo.findOne({ where: { email } });
        if (clash) {
          throw new ConflictException('Email is already in use');
        }
        user.email = email;
      }
    }

    if (dto.password !== undefined) {
      user.password = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }

    const saved = await this.usersRepo.save(user);
    return this.withoutPassword(saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.usersRepo.delete({ id });
    if (!result.affected) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return { message: 'User deleted successfully' };
  }

  private withoutPassword(user: User): PublicUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}