import { z } from 'zod';

export const productSchema = z.object({
  barcode: z.string().min(1, { message: 'Barcode product required' }),
  name: z.string().min(1, { message: 'Name product required' }),
  photoLink: z
    .url({ message: 'Photo link must be a valid URL' })
    .min(1, { message: 'Photo link is required' }),
  buyPrice: z
    .number({ message: 'buyPrice product must be number, example: 9000' })
    .min(1, { message: 'buyPrice product required' }),
  sellPrice: z
    .number({ message: 'sellPrice must be a number, example: 9000' })
    .min(1, { message: 'sellPrice product required' }),
  actualStock: z
    .number({ message: 'actualStock must be a number' })
    .min(0, { message: 'actualStock is required' }),
});

export type ProductTypeDto = z.infer<typeof productSchema>;
