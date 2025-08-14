import { Module } from '@nestjs/common';
import { StockOpnamesService } from './stock-opnames.service';
import { StockOpnamesController } from './stock-opnames.controller';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [StockOpnamesService],
  controllers: [StockOpnamesController],
})
export class StockOpnamesModule {}
