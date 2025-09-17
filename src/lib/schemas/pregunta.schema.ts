import { z } from 'zod';
import { EjeTematico, OpcionPregunta, Pregunta } from '@/src/generated/prisma';
import { EjeTematicoSchema } from './ejeTematico.schema';

export const OpcionRespuestaSchema = z.object({
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(),
  respuesta: z.string().min(1, { message: 'La respuesta no puede estar vacía.' }),
  correcta: z.boolean(),
  retroalimentacion: z.string().nullable(), 
}); 

export const PreguntaSchema = z.object({  
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(),
  contexto: z.string().min(1, { message: 'El contexto no puede estar vacío.' }),
  imagen: z.string().optional().nullable(),
  enunciado: z.string().min(1, { message: 'El enunciado no puede estar vacío.' }),
  groupFlag: z.string().optional().nullable(),
  opciones: z.array(OpcionRespuestaSchema),
  evidenciaId: z.string().min(1, { message: 'El ID de la evidencia no puede estar vacío.' }),
  ejesTematicos: z.union([
      z.array(z.uuid({ message: 'Cada ID de contenido curricular debe ser un UUID válido.' })),
      z.array(EjeTematicoSchema),
    ]).refine((arr) => arr.length >= 1, { message: 'Debe haber al menos un contenido curricular.' }),
});

// Type para las preguntas
export type PreguntaType = Omit<Pregunta, 'createdAt' | 'updatedAt'>;

// Type para las preguntas con sus relaciones
export type PreguntaWithRelationsType = PreguntaType & {
  opciones: (
    OpcionPregunta
  )[],
  ejesTematicos: (
    Omit<EjeTematico, 'createdAt' | 'updatedAt'>
  )[]
}

// Tipo para el estado del formulario que será usado por useFormState
export type PreguntaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}