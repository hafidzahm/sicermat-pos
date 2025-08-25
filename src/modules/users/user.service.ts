import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './schema/user.schema';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { DatabaseService } from 'src/common/helpers/database/database.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    private readonly db: DatabaseService,
    private readonly bcrypt: BcryptService,
  ) {} // Inject AppService here

  async userCollection() {
    const client = await this.db.getCollection('Users');
    return client;
  }

  async registerNewUser(user: CreateUserDto) {
    try {
      const collection = await this.userCollection();
      const { username, password, role } = user;
      const hashedPassword = this.bcrypt.hashPassword(password);
      const { acknowledged } = await collection.insertOne({
        username,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { acknowledged };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findItemById(id: string) {
    const collection = await this.userCollection();
    const findedUser = await collection.findOne({ _id: new ObjectId(id) });
    if (!findedUser) {
      throw new NotFoundException('User not found');
    }

    const userDto: { _id: string; username: string; role: string } = {
      _id: findedUser._id.toString(),
      username: findedUser.username as string,
      role: findedUser.role as string,
    };
    return userDto;
  }

  async deleteItemById(id: string) {
    const collection = await this.userCollection();
    const foundedUser = await this.findItemById(id);
    try {
      if (foundedUser) {
        await collection.deleteOne({
          _id: new ObjectId(id),
        });

        return { username: foundedUser.username, status: 'success' };
      }
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
