import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Param,
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
  @HttpCode(201)
  @Roles(['admin'])
  async registerNewUser(@Body() body: CreateUserDto) {
    try {
      const { acknowledged } = await this.libs.registerNewUser(body);

      return {
        message: 'success register user',
        statusCreated: acknowledged,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Cannot create new product', {
        cause: new Error(),
        description: 'Internal server error',
      });
    }
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

  @Delete('/username/:usn')
  @Roles(['admin'])
  async deleteUserByUsername(@Param('usn') usn: string) {
    const result = await this.libs.findUserByUsername(usn);
    return {
      message: `User with username ${result?.username} deleted successfully`,
      result,
    };
  }
}
