import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from 'src/app.service';
import type { ProductTypeDto } from './schema/product.schema';

@Injectable()
export class ProductService {
  constructor(private libs: AppService) {}

  async productCollection() {
    const collection = await this.libs.getCollectionDevelopment('Products');
    return collection;
  }

  async addProduct(product: ProductTypeDto) {
    const collection = await this.productCollection();
    const newProduct = {
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const barcode = newProduct.barcode;
    try {
      // check unique barcode
      // same barcode found
      await this.getProductByBarcode(barcode);
      Logger.debug('Same product barcode found', 'addProduct');
      throw new ConflictException('Same product barcode detected.');
    } catch (error) {
      if (error instanceof NotFoundException) {
        // same product not found
        const { acknowledged } = await collection.insertOne(newProduct);
        Logger.debug({ acknowledged }, 'acknowledge value');
        return { acknowledged };
      }
      // catch other error
      throw error;
    }
  }

  async getProductByBarcode(barcode: string) {
    const collection = await this.productCollection();
    const foundProduct = await collection.findOne({ barcode });
    if (!foundProduct) {
      throw new NotFoundException('Product not found');
    }
    Logger.debug(foundProduct, 'Founded Product');
    return foundProduct;
  }
}
