import {z} from 'zod';
import { ActividadInteractiva, TipoActividadInteractiva } from '@/src/generated/prisma';

// Schema para la validación de la actividad interactiva
export const ActividadInteractivaSchema = z.object({
  id: z.string().uuid().optional(),
  nombre: z.string('El nombre es obligatorio.').trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  tipo: z.nativeEnum(TipoActividadInteractiva, {error: 'El tipo de actividad no es válido.'}),
  match: z.string().min(1, 'El match no puede estar vacío.'),
  retroalimentacion: z.string().min(1, 'La retroalimentación no puede estar vacía.'),
  imagen: z.string().optional().nullable(),
  seccionId: z.string().uuid({ error: 'El ID de la sección es obligatorio.' }),
})

// Type para la actividad interactiva
export type ActividadInteractivaType = Omit<ActividadInteractiva, 'createdAt' | 'updatedAt'> & {
  ejeTematicoId?: string
}