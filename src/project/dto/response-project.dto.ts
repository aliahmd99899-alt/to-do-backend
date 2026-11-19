import { Expose } from 'class-transformer';

export class ResponseProjectDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() color: string;
  @Expose() userId: string;
  @Expose() createdAt: Date;
}