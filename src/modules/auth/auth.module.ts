import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/users/user.module';
import { AuthController } from './auth.controller';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';
import { jwtConstants } from './auth.constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    BcryptModule,

    // If you want JwtModule to be available globally, uncomment the next line.
    // global: true can cause side effects if multiple modules use JWT.
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: new jwtConstants(configService).getSecret(),
        signOptions: {
          expiresIn: new jwtConstants(configService).getExpiresIn(),
        },
      }),
    }),
  ],
  providers: [AuthService, jwtConstants],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
