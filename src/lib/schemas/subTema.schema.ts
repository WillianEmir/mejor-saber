import {z} from 'zod';
import { ProgresoSubTema, SubTema } from '@/src/generated/prisma';

// ----- ******* ----- //
// ----- SUBTEMA ----- //
// ----- ******* ----- //

// Schema para la validación de los subtemas
export const SubTemaSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcion: z.string().min(1, 'La descripción no puede estar vacía.'),
  imagen: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  ejemplo: z.string().optional().nullable(),
  seccionId: z.uuid({message: 'El ID de contenido curricular debe ser un UUID válido.'})
})

// Type para los subtemas
export type SubTemaType = Omit<SubTema, 'createdAt' | 'updatedAt'>

// Tipo para el estado del formulario que será usado por useFormState
export type SubTemaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}

// ----- **************** ----- //
// ----- PROGRESO SUBTEMA ----- //
// ----- **************** ----- //

// Schema para la validación del Progreso de un subtema
export const ProgresoSubTemaSchema = z.object({
  id: z.string().optional(),
  completado: z.boolean(),
  usuarioId: z.uuid({message: 'El ID del usuario debe ser un UUID válido.'}),
  subTemaId: z.uuid({message: 'El ID del subtema debe ser un UUID válido.'})
})

// Type para el Progreso de un subtema
export type ProgresoSubTemaType = Omit<ProgresoSubTema, 'createdAt' | 'updatedAt'>

// Tipo para el estado del formulario que será usado por useFormState
export type ProgresoSubTemaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}