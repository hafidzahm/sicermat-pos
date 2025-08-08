import { Injectable, Logger } from '@nestjs/common';
import { AppService } from 'src/app.service';
import type { ProductTypeDto } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(private libs: AppService) {}

  async productCollecion() {
    const collection = await this.libs.getCollectionDevelopment('Products');
    return collection;
  }

  async addProduct(product: ProductTypeDto) {
    const collection = await this.productCollecion();
    const newProduct = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { acknowledged } = await collection.insertOne(newProduct);
    Logger.debug({ acknowledged }, 'acknowledge value');

    return { acknowledged };
  }
}
