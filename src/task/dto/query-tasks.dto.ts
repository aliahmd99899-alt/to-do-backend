import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';

const toBoolean = ({ value }: { value: unknown }): boolean | undefined => {
  if (value === undefined || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return undefined;
};

export class QueryTasksDto {
  @IsOptional() @Transform(toBoolean) @IsBoolean() done?: boolean;
  @IsOptional() @Transform(toBoolean) @IsBoolean() archived?: boolean;
  @IsOptional() @IsEnum(TaskCategory) category?: TaskCategory;
  @IsOptional() @IsUUID('4') projectId?: string;
}