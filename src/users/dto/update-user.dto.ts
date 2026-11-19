import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';
 

// PartialType(CreateUserDto) makes every field — password included — optional.
export class UpdateUserDto extends PartialType(CreateUserDto) {}