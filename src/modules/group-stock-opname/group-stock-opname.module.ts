import { Module } from '@nestjs/common';
import { GroupStockOpnameController } from './group-stock-opname.controller';
import { GroupStockOpnameService } from './group-stock-opname.service';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [GroupStockOpnameController],
  providers: [GroupStockOpnameService],
})
export class GroupStockOpnameModule {}
