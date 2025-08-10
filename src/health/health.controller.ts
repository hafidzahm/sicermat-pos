import { Controller, Get, HttpStatus } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { MongoHealthIndicator } from './mongo.health';

@Controller('/api/health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongo: MongoHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  liveness() {
    return this.health.check([]);
  }

  @Get('/readiness')
  @HealthCheck()
  async readiness() {
    const results = await this.health.check([
      async () => this.mongo.isHealthy('mongo'),
      async () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => this.memory.checkRSS('memory_rss', 150 * 1024 * 1024),
    ]);

    // status Terminus = 'ok' bila semua up
    const allGood = results.status === 'ok';
    const statusCode = allGood ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    const body = {
      ...results,
      timestamp: new Date().toISOString(),
    };

    return {
      statusCode,
      ...body,
    };
  }
}
