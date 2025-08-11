import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { ProductModule } from './products/product.module';
import { DatabaseModule } from './common/helpers/database/database.module';
import { HealthModule } from './health/health.module';
import { envValidationSchema } from './common/config/env.validation';
import { GroupStockOpnameController } from './group-stock-opname/group-stock-opname.controller';
import { GroupStockOpnameModule } from './group-stock-opname/group-stock-opname.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
