import { Afirmacion, Evidencia } from '@/src/generated/prisma';
import { z } from 'zod';

// Esquema de validación para la creación/edición de una Afirmación 
export const AfirmacionSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  nombre: z.string({ error: 'El nombre es obligatorio.' }).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  competenciaId: z.string({ error: 'El id de la competencia es obligatoria.' })
});

// Type para las afirmaciones
export type AfirmacionType = Omit<Afirmacion, 'createdAt' | 'updatedAt'>;

// Type para las afirmaciones con sus relaciones
export type AfirmacionWithEvidencias = AfirmacionType & {
  evidencias: Omit<Evidencia, 'createdAt' | 'updatedAt'>[]
}

// Tipo para el estado del formulario que será usado por useFormState
export type AfirmacionFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
}
