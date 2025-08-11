import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/common/helpers/database/database.service';
import { GroupStockOpnameDto } from './schema/group-stock-opname.schema';

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
}
