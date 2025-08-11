import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { MongoHealthIndicator } from './mongo.health';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [
    TerminusModule.forRoot({
      errorLogStyle: 'pretty',
    }),
    DatabaseModule,
  ],
  controllers: [HealthController],
  providers: [MongoHealthIndicator],
})
export class HealthModule {}
