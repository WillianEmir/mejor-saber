import { Afirmacion, Area, Competencia, Evidencia } from '@/src/generated/prisma';
import { z } from 'zod'; 

// Esquema de validación para la creación/edición de una Competencia
export const CompetenciaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  areaId: z.string({ error: 'El id del área es obligatorio.' }),
  nombre: z.string({ error: 'El nombre de la competencia es obligatorio.' }).trim().min(3, { message: 'El nombre de la competencia debe tener al menos 3 caracteres.' }),
});

// Type para las competencias
export type CompetenciaType = Omit<Competencia, 'createdAt' | 'updatedAt'>
export type CompetenciaWithAreaType = CompetenciaType & { area: Area }

// Type para las competencias con sus relaciones
export type CompetenciaWithRelationsType = CompetenciaType & {
  afirmaciones: (
    Omit<Afirmacion, 'createdAt' | 'updatedAt'> & {
      evidencias: Omit<Evidencia, 'createdAt' | 'updatedAt'>[]
    }
  )[]
}
