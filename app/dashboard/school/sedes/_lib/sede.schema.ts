import { z } from 'zod'

export const SedeSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  DANE: z.string().min(1, { message: 'El DANE es requerido' }),
  schoolId: z.string().optional(),
})
