import { Body, Controller, Logger, Post, UsePipes } from '@nestjs/common';
import { GroupStockOpnameService } from './group-stock-opname.service';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import { groupStockOpnameSchema } from './schema/group-stock-opname.schema';
import type { GroupStockOpnameDto } from './schema/group-stock-opname.schema';

@Controller('api/stock-opname/groups')
export class GroupStockOpnameController {
  constructor(private readonly libs: GroupStockOpnameService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(groupStockOpnameSchema))
  async createNewGroupStockOpname(@Body() body: GroupStockOpnameDto) {
    Logger.debug({ body }, 'Body');

    const response = await this.libs.createNewGroupStockOpname(body);
    return {
      status: response,
      message: `Group SO with name ${body.groupName} successfully created`,
    };
  }
}
