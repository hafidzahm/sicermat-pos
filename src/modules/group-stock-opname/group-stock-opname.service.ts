import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/common/helpers/database/database.service';
import { type GroupStockOpnameDto } from './schema/group-stock-opname.schema';
import { ObjectId, WithId } from 'mongodb';

@Injectable()
export class GroupStockOpnameService {
  constructor(private readonly db: DatabaseService) {}

  async getCollection() {
    return await this.db.getCollection('GroupStockOpnames');
  }

  async createNewGroupStockOpname(body: GroupStockOpnameDto) {
    const newBody = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const collection = await this.getCollection();
      const { acknowledged } = await collection.insertOne(newBody);
      return acknowledged;
    } catch (error) {
      Logger.error(error, 'createNewGroupStockOpname');
    }
  }

  async getItemById(id: string) {
    const collection = await this.getCollection();
    const foundedItem = await collection.findOne<WithId<GroupStockOpnameDto>>({
      _id: new ObjectId(id),
    });

    Logger.debug(foundedItem, 'foundedItem');
    if (!foundedItem) {
      throw new NotFoundException('Group Stock Opname not found');
    }

    return {
      item: foundedItem,
      name: foundedItem?.groupName,
    };
  }

  async deleteItemById(id: string) {
    const collection = await this.getCollection();
    const result = await this.getItemById(id);
    const name = result.name;
    if (result && result.item) {
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
      });

      return { result, name };
    }
  }
}
