import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type LoginUserDto } from '../users/schema/user.schema';
import { AuthGuard } from '../../common/guards/auth.guard';

import type { Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { type UserPayload } from 'src/common/types/user.payload.type';
import { Public } from 'src/common/metadatas/public.metadata';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public() //!Public routes
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token } = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    // Logger.debug({ response }, 'entityResponse');
    response.cookie('Authorization', `Bearer ${access_token}`);
    return { access_token };
  }

  @Get('profile')
  getProfile(@User() userLogin: UserPayload) {
    // Logger.debug({ userLogin }, 'getProfile');
    return { userLogin };
    // return { authorization };;
  }
}
