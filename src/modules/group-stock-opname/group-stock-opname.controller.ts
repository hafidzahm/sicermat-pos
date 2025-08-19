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

  @Get()
  async getAllGroupStockOpname() {
    const result = await this.libs.getAllItem();
    return { result };
  }

  @Get(':id')
  async getGroupStockOpnameById(@Param('id') id: string) {
    const result = await this.libs.getItemById(id);
    return {
      result: result.item,
      name: result.name,
      message: `Group Stock Opname with inputed id named '${result.name}' found`,
    };
  }

  @Delete(':id')
  async deleteGroupStockOpnameById(@Param('id') id: string) {
    const result = await this.libs.deleteItemById(id);
    return {
      status: result?.result?.acknowledged,
      name: result?.name,
      message: `Group Stock Opname with inputed id named '${result?.name}' deleted sucessfully`,
    };
  }

  @Put(':id')
  async updateDataGroupStockOpnameById(
    @Body() body: GroupStockOpnameDto,
    @Param('id') id: string,
  ) {
    const result = await this.libs.updateItemById(id, body);
    return {
      status: result?.result?.acknowledged,
      name: result?.name,
      message: `Group Stock Opname with name '${result?.name}' updated successfully`,
    };
  }
}
