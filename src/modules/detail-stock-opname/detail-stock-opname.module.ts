import { Module } from '@nestjs/common';
import { DetailStockOpnameService } from './detail-stock-opname.service';
import { DetailStockOpnameController } from './detail-stock-opname.controller';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DetailStockOpnameController],
  providers: [DetailStockOpnameService],
})
export class DetailStockOpnameModule {}
