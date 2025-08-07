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
      const hashedPassword = this.lib.hashPassword(password);
      const { acknowledged } = await collection.insertOne({
        username,
        password: hashedPassword,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log({ statusRegisterUser: acknowledged });

      return { acknowledged };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
