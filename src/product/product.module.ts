import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { AppService } from 'src/app.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, AppService],
})
export class ProductModule {}
