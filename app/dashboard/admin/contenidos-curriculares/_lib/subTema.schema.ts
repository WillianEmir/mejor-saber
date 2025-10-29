import {z} from 'zod';
import { SubTema } from '@/src/generated/prisma';

// Schema para la validación de los subtemas
export const SubTemaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcion: z.string().min(1, 'La descripción no puede estar vacía.'),
  imagen: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  ejemplo: z.string().optional().nullable(),
  seccionId: z.string().uuid({message: 'El ID de la sección debe ser un UUID válido.'})
})

// Type para los subtemas
export type SubTemaType = Omit<SubTema, 'createdAt' | 'updatedAt'> & {
  ejeTematicoId?: string
}