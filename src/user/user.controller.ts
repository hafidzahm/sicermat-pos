import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto } from './schema/user.schema';
import { createUserSchema } from './schema/user.schema';
import { ZodValidationPipe } from 'src/pipes/pipes';

@Controller('/api/user')
export class UserController {
  constructor(private readonly libs: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async registerNewUser(@Body() body: CreateUserDto) {
    try {
      const { username, role } = body;
      await this.libs.registerNewUser(body);
      return { message: 'success register user', username, role };
    } catch (error) {
      console.log(error);
    }
  }
}
