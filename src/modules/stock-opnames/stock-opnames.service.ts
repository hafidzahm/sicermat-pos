import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/helpers/database/database.service';
import { StockOpnameDto } from './schema/stock-opnames.schema';
import { ObjectId } from 'mongodb';
@Injectable()
export class StockOpnamesService {
  constructor(private readonly db: DatabaseService) {}

  async collection() {
    return await this.db.getCollection('StockOpnames');
  }

  async addItem(item: StockOpnameDto) {
    const collection = await this.collection();
    const newItem = {
      ...item,
      UserId: typeof item.UserId === 'string' && new ObjectId(item.UserId), //TODO: UBAH KE ID USER LOGIN
      GroupStockOpnameId:
        typeof item.GroupStockOpnameId === 'string' &&
        new ObjectId(item.GroupStockOpnameId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const { acknowledged } = await collection.insertOne(newItem);
      return acknowledged;
    } catch (error) {
      Logger.error(error, 'addItem StockOpnameService');
      throw new InternalServerErrorException('Unable to add StockOpname');
    }
  }
}
