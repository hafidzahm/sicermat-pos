import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AppService } from 'src/app.service';
import { DatabaseModule } from 'src/common/helpers/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductController],
  providers: [ProductService, AppService],
})
export class ProductModule {}
