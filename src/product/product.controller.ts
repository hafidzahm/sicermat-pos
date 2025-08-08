import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/pipes';
import { productSchema } from './schema/product.schema';
import type { ProductTypeDto } from './schema/product.schema';
import { ProductService } from './product.service';

@Controller('/api/products')
export class ProductController {
  constructor(private libs: ProductService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(productSchema))
  async createNewProduct(@Body() product: ProductTypeDto) {
    try {
      const { acknowledged } = await this.libs.addProduct(product);

      return {
        status: acknowledged,
        name: product.name,
        message: `${product.name} successfully added`,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Cannot create new product', {
        cause: new Error(),
        description: 'Internal server error',
      });
    }
  }
}
