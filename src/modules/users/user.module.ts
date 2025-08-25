import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [BcryptModule, DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
