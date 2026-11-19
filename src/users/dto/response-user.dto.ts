import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @Expose() id: string;
  @Expose() name: string;
  @Expose() email: string;
  @Expose() createdAt: Date;

  // password deliberately absent — never add it.
}