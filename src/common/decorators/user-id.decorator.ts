import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * يقرأ userId من المستخدم الذي وضعه JwtAuthGuard في request.user.
 * يجب استخدامه فقط على مسارات عليها @UseGuards(JwtAuthGuard).
 */
export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const userId = ctx.switchToHttp().getRequest().user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  },
);