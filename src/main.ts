import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { AuthGuard } from './common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // somewhere in your initialization file
  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalGuards(
    new AuthGuard(new JwtService(), new Reflector()),
    new RolesGuard(new Reflector()),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
