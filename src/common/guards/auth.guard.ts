import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../metadatas/public.metadata';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ! CEK DULU APAKAH ADA DECORATOR @Public()
    // ! KALO ADA PASS THIS GUARD
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    Logger.debug({ isPublic }, 'MetadataPublic');
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    // ! JIKA @Public() decorator tidak dipasang
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    // Logger.debug({ token }, 'AuthGuard');
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: Record<string, unknown> =
        await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });
      Logger.debug({ payload }, 'payload');
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (error) {
      Logger.debug(error, 'ErrorPayload');
      // ! jika user tidak punya cookies Authorization
      throw new UnauthorizedException();
    }
    // ! all check passed
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    // Logger.debug({ request }, 'ExtractorTOkenDEbug');
    const authorizationCookies =
      request.cookies && 'Authorization' in request.cookies
        ? (request.cookies.Authorization as string)
        : undefined;
    if (!authorizationCookies) {
      return undefined;
    }
    const [type, token] = authorizationCookies.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
