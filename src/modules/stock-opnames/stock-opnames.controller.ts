import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { StockOpnamesService } from './stock-opnames.service';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import { stockOpnameSchema } from './schema/stock-opnames.schema';
import type { StockOpnameDto } from './schema/stock-opnames.schema';

@Controller('/api/stock-opnames')
export class StockOpnamesController {
  constructor(private readonly libs: StockOpnamesService) {}
  // gabung ke group so
  @Post()
  @UsePipes(new ZodValidationPipe(stockOpnameSchema))
  async createNewStockOpname(@Body() item: StockOpnameDto) {
    Logger.debug(item, 'item');
    const status = await this.libs.addItem(item);
    return {
      status,
      message: 'new stock opname successfully included to user/ group!',
    };
  }

  @Get()
  async getAllStockOpname() {
    const result = await this.libs.getAllItem();
    return {
      result,
    };
  }

  @Get(':id')
  async getStockOpnameById(@Param('id') id: string) {
    const result = await this.libs.getItemById(id);
    return {
      result: result.item,
      message: 'Stock opname with inputed id found',
    };
  }

  @Delete(':id')
  async deleteStockOpnameById(@Param('id') id: string) {
    const result = await this.libs.deleteItemById(id);
    return {
      status: result?.acknowledged,
      message: 'Stock opname removed from group successfully',
    };
  }

  @Put(':id')
  async changeStockOpname(
    @Param('id') id: string,
    @Body() body: StockOpnameDto,
  ) {
    const result = await this.libs.changeDataItem(id, body);
    return {
      status: result?.acknowledged,
      message: 'Stock opname changed successfully',
    };
  }
}
