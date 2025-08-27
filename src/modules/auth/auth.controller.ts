import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
  Logger,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { type LoginUserDto } from '../users/schema/user.schema';
import { AuthGuard } from './auth.guard';

import type { Request, Response } from 'express';
import { AuthenticationRequest } from 'src/common/types/AuthenticationRequest';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

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
    Logger.debug({ response }, 'entityResponse');
    response.cookie('Authorization', `Bearer ${access_token}`);
    return { access_token };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() request: Request) {
    Logger.debug({ request }, 'getProfile');
    return (request as AuthenticationRequest).user;
    // return { authorization };;
  }
}
