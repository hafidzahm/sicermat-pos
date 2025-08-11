// src/config/env.validation.ts
import Joi from 'joi';

export const envMap: Record<string, string> = {
  development: '.env.development',
  test: '.env.test',
};

export const envValidationSchema = Joi.object({
  // Database
  MONGO_URI: Joi.string().uri().required(),
  MONGO_DB_NAME: Joi.string().min(1).required(),

  // contoh lain (opsional)
  PORT: Joi.number().default(3000),
}).unknown(true); // allow env lain yg tidak didefinisikan
