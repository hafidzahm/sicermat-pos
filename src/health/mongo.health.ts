import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from 'src/common/helpers/database/database.service';

@Injectable()
export class MongoHealthIndicator extends HealthIndicator {
  constructor(private readonly db: DatabaseService) {
    super();
  }

  async isHealthy(key = 'value'): Promise<HealthIndicatorResult> {
    try {
      const database = this.db.getDatabase('Sicermat-DB');
      await (await database).command({ ping: 1 });
      return this.getStatus(key, true);
    } catch (error) {
      return this.getStatus(key, false, { message: (error as Error).message });
    }
  }
}
