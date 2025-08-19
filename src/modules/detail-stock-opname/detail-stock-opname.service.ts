import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DatabaseService } from 'src/common/helpers/database/database.service';
import { DetailStockOpnameSchemaDto } from './schema/detail-stock-opname.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class DetailStockOpnameService {
  constructor(private readonly db: DatabaseService) {}

  async getCollection() {
    return await this.db.getCollection('DetailStockOpnames');
  }

  async createItem(item: DetailStockOpnameSchemaDto) {
    const collection = await this.getCollection();
    const newItem = {
      ...item,
      StockOpnameId: new ObjectId(item.StockOpnameId),
      ProductId: new ObjectId(item.ProductId),
      differenceStock: item.resultStock - item.systemStock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await collection.insertOne(newItem);
      return result;
    } catch (error) {
      Logger.error(error, 'createItem DetailStockOpnameService');
      throw new InternalServerErrorException();
    }
  }
}
