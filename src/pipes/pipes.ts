import {
  PipeTransform,
  BadRequestException,
  Logger,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      // Only validate request body; pass through params/queries/etc.
      if (metadata.type !== 'body') return value;
      Logger.debug({ type: typeof value, value }, 'ZodValidationPipe');

      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      Logger.error(error, 'ErrorFromPipes');
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((i) => i.message);
        throw new BadRequestException(formattedErrors[0]);
      }
      throw error;
    }
  }
}
