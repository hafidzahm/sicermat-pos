import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';

@Global()
@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getDatabase(nameDatabase: string): Promise<Db> {
    const MONGO_URI = this.configService.get<string>('MONGO_URI');
    // console.log(MONGO_URI, '<----- ENV');

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(MONGO_URI as string);

    try {
      // Send a ping to confirm a successful connection
      await client.db(nameDatabase).command({ ping: 1 });
      console.log(
        `You successfully connected to MongoDB! Currently on db ${nameDatabase}`,
      );
      return client.db(nameDatabase);
    } catch (error) {
      console.log(`db connection fail: ${error}`);

      await client.close();
      throw error;
    }
  }

  async getCollectionDevelopment(nameCollection: string): Promise<Collection> {
    const database: Db = await this.getDatabase('SiCermat-DB');
    return database.collection(nameCollection);
  }

  hashPassword(plainPassword: string) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plainPassword, salt);
    return hash;
  }

  comparePassword(plainPassword: string, hashedPassword: string) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  }
}
