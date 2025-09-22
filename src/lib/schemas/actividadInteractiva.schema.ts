import {z} from 'zod';
import { ActividadInteractiva, ProgresoActividad, TipoActividadInteractiva } from '@/src/generated/prisma';

// ----- ********************* ----- //
// ----- ACTIVIDAD INTERACTIVA ----- //
// ----- ********************* ----- //

// Schema para la validación de la actividad interactiva
export const ActividadInteractivaSchema = z.object({
  id: z.uuid().optional(),
  nombre: z.string('El nombre es obligatorio.').trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  tipo: z.enum(TipoActividadInteractiva, {error: 'El tipo de actividad no es válido.'}),
  match: z.string().min(1, 'El match no puede estar vacío.'),
  retroalimentacion: z.string().min(1, 'La retroalimentación no puede estar vacía.'),
  imagen: z.string().optional().nullable(),
  seccionId: z.uuid({ error: 'El ID del eje temático es obligatorio.' })
})

// Type para la actividad interactiva
export type ActividadInteractivaType = Omit<ActividadInteractiva, 'createdAt' | 'updatedAt'>

// Tipo para el estado del formulario que será usado por useFormState
export type ActividadInteractivaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
} 

// ----- ****************************** ----- //
// ----- PROGRESO ACTIVIDAD INTERACTIVA ----- //
// ----- ****************************** ----- //

// Schema para la validación del progreso de la actividad interactiva
export const ProgresoActividadInteractivaSchema = z.object({
  id: z.uuid().optional(),
  completado: z.boolean(),
  intentos: z.number().min(0),
  usuarioId: z.uuid({ error: 'El ID del usuario es obligatorio.' }),
  actividadId: z.uuid({ error: 'El ID de la actividad interactiva es obligatorio.' })
})

// Type para el progreso de la actividad interactiva
export type ProgresoActividadInteractivaType = Omit<ProgresoActividad, 'createdAt' | 'updatedAt'>

// Tipo para el estado del formulario que será usado por useFormState
export type ProgresoActividadInteractivaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
} 