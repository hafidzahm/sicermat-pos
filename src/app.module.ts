import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './common/config/env.validation';
import { UserModule } from './modules/users/user.module';
import { ProductModule } from './modules/products/product.module';
import { HealthModule } from './modules/health/health.module';
import { GroupStockOpnameModule } from './modules/group-stock-opname/group-stock-opname.module';
import { DatabaseModule } from './common/helpers/database/database.module';
import { StockOpnamesModule } from './modules/stock-opnames/stock-opnames.module';
import { DetailStockOpnameModule } from './modules/detail-stock-opname/detail-stock-opname.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.development',
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false }, // tampilkan semua error env

      isGlobal: true, //konfigurasi env secara global
    }),
    UserModule,
    ProductModule,
    DatabaseModule,
    HealthModule,
    GroupStockOpnameModule,
    StockOpnamesModule,
    DetailStockOpnameModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
