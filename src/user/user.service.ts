import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CreateUserDto } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly lib: AppService) {} // Inject AppService here

  async userCollection() {
    const client = await this.lib.getCollectionDevelopment('Users');
    return client;
  }

  async registerNewUser(user: CreateUserDto) {
    try {
      const collection = await this.userCollection();
      const { username, password, role } = user;
      await collection.insertOne({
        username,
        password,
        role,
      });
      console.log('success register user!');

      return { username, password };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
