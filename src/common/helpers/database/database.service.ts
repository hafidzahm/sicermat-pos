import { Global, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Collection, Db, MongoClient } from 'mongodb';

@Global()
@Injectable()
export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  constructor(private readonly configService: ConfigService) {}

  async getDatabase(): Promise<Db> {
    if (this.client && this.db) {
      // Logger.debug({ client: this.client, db: this.db }, 'UndefinedDb');
    }

    const uri = this.configService.get<string>('MONGO_URI');
    const dbName = this.configService.get<string>('MONGO_DB_NAME');

    if (!uri) {
      throw new Error(
        'MONGO_URI is not set. Did you load ConfigModule / .env?',
      );
    }
    if (!dbName) {
      throw new Error('MONGO_DB_NAME is not set.');
    }

    try {
      this.client = new MongoClient(uri);
      await this.client.connect();

      this.db = this.client.db(dbName);
      await this.db.command({ ping: 1 });

      // Log safe info only (don’t print the whole URI)
      Logger.log(`Mongo connected → DB="${dbName}"`, 'DatabaseService');
      return this.db;
    } catch (error) {
      Logger.error(error, 'mongoDbConnector');
      throw error;
    }
  }

  async getCollection(nameCollection: string): Promise<Collection> {
    const database: Db = await this.getDatabase();
    return database.collection(nameCollection);
  }
}
