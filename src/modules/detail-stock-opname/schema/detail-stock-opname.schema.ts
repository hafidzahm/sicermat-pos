import { z } from 'zod';
export const detailStockOpnameSchema = z.object({
  StockOpnameId: z.string().min(1, { message: 'StockOpnameId required' }),
  ProductId: z.string().min(1, { message: 'ProductId required' }),
  systemStock: z.number().min(0, { message: 'systemStock required' }),
  resultStock: z.number().min(0, { message: 'resultStock required' }),
  differenceStock: z.number().optional(),
});

export type DetailStockOpnameSchemaDto = z.infer<
  typeof detailStockOpnameSchema
>;
