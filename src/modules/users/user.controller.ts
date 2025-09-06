import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { CreateUserDto } from './schema/user.schema';
import { createUserSchema } from './schema/user.schema';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('/api/users')
export class UserController {
  constructor(private readonly libs: UserService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  @Roles(['admin'])
  async registerNewUser(@Body() body: CreateUserDto) {
    const result = await this.libs.registerNewUser(body);

    return {
      message: 'success register user',
      statusCreated: result?.acknowledged,
    };
  }

  @Get(':id')
  @Roles(['admin'])
  async findUserById(@Param('id') id: string) {
    const result = await this.libs.findItemById(id);
    return result;
  }

  @Delete(':id')
  @Roles(['admin'])
  async deleteUserById(@Param('id') id: string) {
    const result = await this.libs.deleteItemById(id);
    return {
      message: `User with username ${result?.username} deleted successfully`,
      status: result?.status,
      username: result?.username,
    };
  }

  @Patch('/:userId/roles')
  @Roles(['admin'])
  async changeUserRole(
    @Body('role') role: 'karyawan' | 'admin',
    @Param('userId') userId: string,
  ) {
    const result = await this.libs.changeRole(userId, role);

    return {
      message: `username ${result.updatedUser.username} has updated role to ${result.updatedUser.role}`,
      result: result.updatedUser,
    };
  }
}
