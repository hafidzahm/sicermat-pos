import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticationRequest } from '../types/authentication.request.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: AuthenticationRequest = ctx.switchToHttp().getRequest();
    // Logger.debug(request, 'DecoratorUser');
    return request.user;
  },
);
