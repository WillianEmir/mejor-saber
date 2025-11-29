import { Afirmacion, Evidencia } from '@/src/generated/prisma';
import { z } from 'zod';

// Esquema de validación para la creación/edición de una Afirmación  
export const AfirmacionSchema = z.object({
  id: z.string().optional(),
  nombre: z.string().trim().min(3, { message: 'El nombre de la afirmación debe tener al menos 3 caracteres.' }),
  competenciaId: z.string({ error: 'El id de la competencia es obligatoria.' })
});

// Type para las afirmaciones
export type AfirmacionType = Omit<Afirmacion, 'createdAt' | 'updatedAt'>;

// Type para las afirmaciones con sus relaciones
export type AfirmacionWithEvidenciasType = AfirmacionType & {
  evidencias: Omit<Evidencia, 'createdAt' | 'updatedAt'>[]
}
