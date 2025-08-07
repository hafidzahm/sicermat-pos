import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto } from './schema/user.schema';
import { createUserSchema } from './schema/user.schema';
import { ZodValidationPipe } from 'src/pipes/pipes';

@Controller('/api/user')
export class UserController {
  constructor(private readonly libs: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @HttpCode(201)
  async registerNewUser(@Body() body: CreateUserDto) {
    try {
      const { acknowledged } = await this.libs.registerNewUser(body);

      return {
        message: 'success register user',
        statusCreated: acknowledged,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
