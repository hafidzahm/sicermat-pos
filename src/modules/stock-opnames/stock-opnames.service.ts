import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
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
      startedAt: new Date().toISOString(),
      endedAt: '',
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

  async getItemById(id: string) {
    const collection = await this.collection();
    const findedItem = await collection.findOne<StockOpnameDto>({
      _id: new ObjectId(id),
    });

    if (!findedItem) {
      throw new NotFoundException('Stock opname with inputed id not found');
    }

    return { item: findedItem };
  }

  async deleteItemById(id: string) {
    const collection = await this.collection();
    const foundedItem = await this.getItemById(id);

    if (foundedItem && foundedItem.item) {
      const response = await collection.deleteOne({
        _id: new ObjectId(id),
      });

      return response;
    }
  }

  async changeDataItem(id: string, body: StockOpnameDto) {
    const collection = await this.collection();
    const findedItem = await this.getItemById(id);

    if (findedItem && findedItem.item) {
      const changedData = {
        UserId: new ObjectId(body.UserId),
        GroupStockOpnameId: new ObjectId(body.GroupStockOpnameId),
        endedAt: body.endedAt,
        note: body.note,
        updatedAt: new Date().toISOString(),
      };

      return collection.updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: changedData,
        },
      );
    }
  }

  async getAllItem() {
    const collection = await this.collection();
    return await collection.find().toArray();
  }
}
