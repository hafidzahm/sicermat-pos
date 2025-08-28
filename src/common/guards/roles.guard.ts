import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from '../decorators/roles.decorator';
import { type AuthenticationRequest } from '../types/authentication.request.type';
import { ReturnUser } from 'src/modules/users/schema/user.schema';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const assignedRoles = this.reflector.get(Roles, context.getHandler());
    Logger.debug({ assignedRoles }, 'RolesGuard');
    if (!assignedRoles) {
      return true;
    }
    const request: AuthenticationRequest = context.switchToHttp().getRequest();
    const userRole = request?.user?.role;

    Logger.debug({ userRole, assignedRoles }, 'RolesGuard');

    // !cek apakah role yang ditetapkan sama denga role yang user punya
    return assignedRoles.some((role) => role === userRole);
  }
}
