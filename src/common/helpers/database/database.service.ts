import { Global, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, MongoClient } from 'mongodb';

@Global()
@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  async getDatabase(nameDatabase: string): Promise<Db> {
    const MONGO_URI = this.configService.get<string>('MONGO_URI');
    // console.log(MONGO_URI, '<----- ENV');

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(MONGO_URI as string, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 1000, // 1s: pilih server cepat
      socketTimeoutMS: 2000, // 2s: operasi socket
    });

    try {
      // Send a ping to confirm a successful connection
      await client.db(nameDatabase).command({ ping: 1 });
      Logger.log(
        `You successfully connected to MongoDB! Currently on db ${nameDatabase}`,
        'Database MongoDB Connector',
      );
      return client.db(nameDatabase);
    } catch (error) {
      Logger.error(error, 'Database MongoDB Connection Error');

      await client.close();
      throw error;
    }
  }

  async getCollection(nameCollection: string): Promise<Collection> {
    const database: Db = await this.getDatabase('SiCermat-DB');
    return database.collection(nameCollection);
  }
}
