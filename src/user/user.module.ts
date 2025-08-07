import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AppService } from 'src/app.service';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AppService],
})
export class UserModule {}
