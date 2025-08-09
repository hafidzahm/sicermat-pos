import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
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
  // POST /api/product
  // create new product

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
      if (error instanceof ConflictException) {
        throw new ConflictException(error);
      }
      throw new InternalServerErrorException('Cannot create new product', {
        cause: error,
        description: 'Internal server error',
      });
    }
  }

  // GET /api/product/:barcode
  // get product by barcode
  @Get('/:barcode')
  async getProductByBarcode(@Param('barcode') barcode: string) {
    try {
      Logger.debug(barcode, 'barcode');
      const result = await this.libs.getProductByBarcode(barcode);
      Logger.debug(result, 'result');

      return { result };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }
      throw new InternalServerErrorException('Internal server error', {
        cause: error,
        description: 'Cannot get product by barcode',
      });
    }
  }

  // DEL /api/product/:barcode
  // DELETE product by barcode
  @Delete('/:barcode')
  async deleteProductByBarcode(@Param('barcode') barcode: string) {
    try {
      Logger.debug(barcode, 'barcodeToDelete');
      const { acknowledged } = await this.libs.deleteProductByBarcode(barcode);
      return {
        status: acknowledged,
        message: `Product with barcode ${barcode} deleted successfully`,
      };
    } catch (error) {
      Logger.error(error, 'errorDelete');
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }
}
