import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string; // e.g. "Design System", "Mobile App", "Personal Site"

  @IsOptional()
  @IsHexColor()
  color?: string; // "#7C3AED"

}