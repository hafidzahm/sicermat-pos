import { Body, Controller, Logger, Post, UsePipes } from '@nestjs/common';
import { StockOpnamesService } from './stock-opnames.service';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import { stockOpnameSchema } from './schema/stock-opnames.schema';
import type { StockOpnameDto } from './schema/stock-opnames.schema';

@Controller('/api/stock-opnames')
export class StockOpnamesController {
  constructor(private readonly libs: StockOpnamesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(stockOpnameSchema))
  async createNewStockOpname(@Body() item: StockOpnameDto) {
    Logger.debug(item, 'item');
    const status = await this.libs.addItem(item);
    return {
      status,
      message: 'new stock opname successfully added!',
    };
  }
}
