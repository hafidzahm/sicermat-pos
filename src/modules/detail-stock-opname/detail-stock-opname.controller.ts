import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import {
  detailStockOpnameSchema,
  type DetailStockOpnameSchemaDto,
} from './schema/detail-stock-opname.schema';
import { DetailStockOpnameService } from './detail-stock-opname.service';

@Controller('/api/stock-opname/details')
export class DetailStockOpnameController {
  constructor(private readonly libs: DetailStockOpnameService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(detailStockOpnameSchema))
  async createNewDetailStockOpname(@Body() body: DetailStockOpnameSchemaDto) {
    const { acknowledged } = await this.libs.createItem(body);
    return { status: acknowledged, message: 'Detail SO created successfully' };
  }
}
