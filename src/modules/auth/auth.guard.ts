import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    Logger.debug({ token }, 'AuthGuard');
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
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    Logger.debug({ request }, 'ExtractorTOkenDEbug');
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
