import { z } from 'zod'

export const characteristicSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido'),
  productId: z.string(),
})

export type CharacteristicType = z.infer<typeof characteristicSchema>