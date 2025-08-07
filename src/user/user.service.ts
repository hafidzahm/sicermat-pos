import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class UserService {
  constructor(private readonly lib: AppService) {} // Inject AppService here

  async userCollection() {
    const client = await this.lib.getCollectionDevelopment('Users');
    return client;
  }

  async registerNewUser(username: string, password: string) {
    try {
      const collection = await this.userCollection();
      await collection.insertOne({
        username,
        password,
      });
      console.log('success register user!');

      return { username, password };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
