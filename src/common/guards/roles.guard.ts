import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { AuthenticationRequest } from '../types/authentication.request.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    // if (!roles) {
    //   return true;
    // }
    const request: AuthenticationRequest = context.switchToHttp().getRequest();
    const incomingRoles = request.user?.roles as string;
    Logger.debug({ roles, incomingRoles }, 'rolesLogic');
    return this.matchRoles(incomingRoles, roles);
  }

  matchRoles(incomingRoles: string, roles) {
    if (incomingRoles !== roles) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
