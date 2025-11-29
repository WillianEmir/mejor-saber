import { z } from 'zod';
import { Area, Competencia, ContenidoCurricular, Afirmacion, Evidencia } from '@/src/generated/prisma';

// Esquema de validación para la creación/edición de un Área
export const AreaSchema = z.object({
  id: z.uuid({ message: "El ID debe ser un UUID válido." }).optional(),
  nombre: z.string({ message: 'El nombre del Área es obligatorio.' }).trim().min(3, { message: 'El nombre del área debe tener al menos 3 caracteres.' }),
});

// Type para las áreas  
export type Areatype = Omit<Area, 'createdAt' | 'updatedAt'>;

// Type para las áreas con todas sus relaciones 
export type AreaWithRelationsType = Areatype & {
  competencias: (
    Omit<Competencia, 'createdAt' | 'updatedAt'> & {
      afirmaciones: (
        Omit<Afirmacion, 'createdAt' | 'updatedAt'> & {
          evidencias: Omit<Evidencia, 'createdAt' | 'updatedAt'>[]
        }
      )[]
    }
  )[],
  contenidosCurriculares: Omit<ContenidoCurricular, 'createdAt' | 'updatedAt'>[]
}