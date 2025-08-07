import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        // Build a custom error message from Zod issues
        const formattedErrors = error.issues.map((issue) => {
          // const path = issue.path.join('.');
          return issue.message;
        });

        throw new BadRequestException(formattedErrors[0]);
      }
    }
  }
}
