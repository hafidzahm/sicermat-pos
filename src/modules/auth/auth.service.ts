import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { ReturnUser } from '../users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    if (!username) {
      throw new UnauthorizedException('Name required');
    }

    if (!pass) {
      throw new UnauthorizedException('Password required');
    }
    const foundUser = await this.usersService.findUserByUsername(username);
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    const user: ReturnUser = {
      userId: foundUser._id?.toString() ?? '',
      username: foundUser.username as string,
      password: foundUser.password as string,
      role: foundUser.role as 'karyawan' | 'admin',
    };
    const passCondition = this.bcryptService.comparePassword(
      pass,
      user.password,
    );
    if (!passCondition) {
      throw new UnauthorizedException('Name or password not same');
    }

    const payload = { sub: user.userId, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
