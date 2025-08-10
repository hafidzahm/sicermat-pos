import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './schema/user.schema';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { DatabaseService } from 'src/common/helpers/database/database.service';

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
      console.log({ statusRegisterUser: acknowledged });

      return { acknowledged };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
