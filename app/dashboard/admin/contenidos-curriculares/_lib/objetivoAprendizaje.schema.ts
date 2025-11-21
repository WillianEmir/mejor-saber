import { ObjetivoAprendizaje } from '@/src/generated/prisma';
import { z } from 'zod';

// Esquema de validación para la creación/edición de un objetivo de aprendizaje
export const ObjetivoAprendizajeSchema = z.object({
  id: z.uuid().optional(),
  descripcion: z.string().min(1, 'El nombre del objetivo de aprendizaje no puede estar vacío.'),
  ejeTematicoId: z.uuid('El ID del eje temático debe ser un UUID válido.'),
});

// Type para los objetivos de aprendizaje
export type ObjetivoAprendizajeType = Omit<ObjetivoAprendizaje, 'createdAt' | 'updatedAt'>;