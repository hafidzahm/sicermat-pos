import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/users/user.module';
import { jwtConstants } from './auth.constants';
import { AuthController } from './auth.controller';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';

@Module({
  imports: [
    UserModule,
    BcryptModule,

    // If you want JwtModule to be available globally, uncomment the next line.
    // global: true can cause side effects if multiple modules use JWT.
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
