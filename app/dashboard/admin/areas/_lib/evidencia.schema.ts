import { Evidencia } from '@/src/generated/prisma';
import { z } from 'zod';

// Esquema de validación para la creación/edición de una Evidencia
export const EvidenciaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  nombre: z.string().trim().min(3, { message: 'El nombre de la evidencia debe tener al menos 3 caracteres.' }),
  afirmacionId: z.string({error: 'El id de la afirmación es obligatoria.'})
});

// Type para las evidencias
export type EvidenciaType = Omit<Evidencia, 'createdAt' | 'updatedAt'>;
