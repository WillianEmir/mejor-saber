import { z } from 'zod';
import { EjeTematico, OpcionPregunta, Pregunta } from '@/src/generated/prisma';
import { EjeTematicoSchema } from '../../contenidos-curriculares/_lib/ejeTematico.schema';

export const OpcionRespuestaSchema = z.object({
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(), 
  isImage: z.boolean().optional().default(false),
  respuesta: z.string(),
  imageUrl: z.string().optional().nullable(),
  correcta: z.boolean(),
  retroalimentacion: z.string().nullable(),
}).refine(data => {
  if (data.isImage) {
    return !!data.imageUrl; 
  } else {
    return !!data.respuesta && data.respuesta.length > 0;
  }
}, {
  message: 'La opción debe tener una respuesta de texto o una URL de imagen.',
  path: ['respuesta']
});

export const PreguntaSchema = z.object({  
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(),
  contexto: z.string().min(1, { message: 'El contexto no puede estar vacío.' }),
  imagen: z.string().optional().nullable(),
  enunciado: z.string().min(1, { message: 'El enunciado no puede estar vacío.' }),
  groupFlag: z.string().optional().nullable(),
  opciones: z.array(OpcionRespuestaSchema).refine(
    (opciones) => opciones.some(op => op.correcta),
    { message: 'Debe haber al menos una opción correcta.' }
  ),
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