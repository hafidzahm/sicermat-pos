import { z } from 'zod';

export const stockOpnameSchema = z.object({
  UserId: z.string().min(1, { message: 'UserId required' }),
  GroupStockOpnameId: z
    .string()
    .min(1, { message: 'GroupStockOpnameId required' }),
  startedAt: z.string().optional(),
  endedAt: z.string().optional(),
  note: z.string().optional(),
});

export type StockOpnameDto = z.infer<typeof stockOpnameSchema>;
