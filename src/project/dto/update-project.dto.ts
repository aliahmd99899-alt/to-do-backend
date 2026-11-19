import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

// userId omitted — ownership transfer shouldn't be a generic PATCH.
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}