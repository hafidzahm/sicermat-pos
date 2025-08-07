import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
  constructor(private readonly libs: UserService) {}

  @Post()
  async registerNewUser(@Body() body: { username: string; password: string }) {
    try {
      const { username, password } = body;
      await this.libs.registerNewUser(username, password);
      return { message: 'success register user', username };
    } catch (error) {
      console.log(error);
    }
  }
}
