import { z } from 'zod';

export const groupStockOpnameSchema = z.object({
  groupName: z.string().min(1, { message: 'Group SO name required' }),
  description: z.string().min(1, { message: 'Description required' }),
  note: z.string().optional(),
});

export type GroupStockOpnameDto = z.infer<typeof groupStockOpnameSchema>;
