import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { ProductTypeDto } from './schema/product.schema';
import { DatabaseService } from 'src/common/helpers/database/database.service';

@Injectable()
export class ProductService {
  constructor(private db: DatabaseService) {}

  async productCollection() {
    const collection = await this.db.getCollection('Products');
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

  async deleteProductByBarcode(barcode: string) {
    const collection = await this.productCollection();
    // check product first, its the product already created?
    await this.getProductByBarcode(barcode);
    // if it found continue to delete logic, if not found will throw error from foundedProduct
    const result = await collection.deleteOne({ barcode });

    return result;
  }

  async getAllProducts() {
    const collection = await this.productCollection();
    const results = await collection.find().toArray();
    return results;
  }

  async updateDetailProduct(barcode: string, newDetailProduct: ProductTypeDto) {
    // check if the product has already been created
    await this.getProductByBarcode(barcode);

    const collection = await this.productCollection();

    Logger.debug(newDetailProduct, 'updateDetailProduct');
    const result = await collection.updateOne(
      {
        barcode,
      },
      {
        $set: {
          // Only allow updatable fields, omit 'barcode' and 'createdAt'
          ...Object.fromEntries(
            Object.entries(newDetailProduct).filter(
              ([key]) => key !== 'barcode' && key !== 'createdAt',
            ),
          ),
          updatedAt: new Date().toISOString(),
        },
      },
    );

    return result;
  }
}
