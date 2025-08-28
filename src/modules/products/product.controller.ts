import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { productSchema } from './schema/product.schema';
import type { ProductTypeDto } from './schema/product.schema';
import { ProductService } from './product.service';
import { ZodValidationPipe } from 'src/common/pipes/pipes';
import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { type UserPayload } from 'src/common/types/user.payload.type';
import { RolesGuard } from 'src/common/guards/roles.guard';
// @UseGuards(RolesGuard)
@Controller('/api/products')
export class ProductController {
  constructor(private libs: ProductService) {}

  // POST /api/product
  // create new product
  @Post()
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

  // PUT /api/product/:barcode
  // update all detail product by barcode

  // Issue documentation:

  // Because @UsePipes at the method level runs the pipe for every parameter of the handler (Body, Param, Query, etc.).
  // In your PUT handler, it tries to validate both:

  // @Param('barcode') → a string
  // @Body() → an object

  // solution: Option B: Keep @UsePipes, but make the pipe skip non-body params.
  // pipes ts:
  //  // Only validate request body; pass through params/queries/etc.
  // if (metadata.type !== 'body') return value;

  @Put('/:barcode')
  @UsePipes(new ZodValidationPipe(productSchema))
  async updateDetailProductByBarcode(
    @Body() product: ProductTypeDto,
    @Param('barcode') barcode: string,
  ) {
    try {
      Logger.debug(product, 'BodyInput');
      const { acknowledged } = await this.libs.updateDetailProduct(
        barcode,
        product,
      );

      return {
        status: acknowledged,
        message: `Product with barcode ${barcode} updated successfully`,
      };
    } catch (error) {
      Logger.error(error, 'errorUpdateProduct');
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error);
      }

      throw new InternalServerErrorException('Internal server error');
    }
  }

  // GET /api/product
  // get all product

  @Roles(['karyawan']) //! pasang sepasang dengan useGuards(RoleGuard) per container atau useGlobalGuards di main ts buat global guards
  @Get()
  async getAllProduct() {
    const products = await this.libs.getAllProducts();
    return { results: products };
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

      throw new InternalServerErrorException('Internal server error', {
        cause: error,
        description: 'Cannot delete product by barcode',
      });
    }
  }
}
