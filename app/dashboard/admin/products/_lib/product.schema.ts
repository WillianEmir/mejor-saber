import { z } from 'zod';
import { CharacteristicType } from './characteristic.schema';

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  price: z.coerce.number().min(0, 'El precio no puede ser negativo'),
  durationInDays: z.coerce.number().int().min(1, 'La duración debe ser al menos 1 día'),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type ProductType = z.infer<typeof ProductSchema> & {
  characteristics: CharacteristicType[];
}