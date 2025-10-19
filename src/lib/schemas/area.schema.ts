import { z } from 'zod'; 
import { Area, Competencia, ContenidoCurricular, EjeTematico, Afirmacion, Evidencia } from '@/src/generated/prisma';

// Esquema de validación para la creación/edición de un Área
export const AreaSchema = z.object({
  id: z.uuid().optional(), // Opcional, solo presente en edición 
  nombre: z.string({ error: 'El nombre es obligatorio.' }).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

// Type para las áreas 
export type Areatype = Omit<Area, 'createdAt' | 'updatedAt'>;

// Definición de tipos para el material de repaso con progreso
type EjeTematicoConProgreso = EjeTematico & {
  progress?: number;
};

type ContenidoCurricularConEjes = ContenidoCurricular & {
  ejesTematicos: EjeTematicoConProgreso[];
};

export type MaterialRepasoType = Area & {
  contenidosCurriculares: ContenidoCurricularConEjes[];
};


// Tipo para las áreas con todas sus relaciones
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
} | null

// Tipo para el estado del formulario que será usado por useFormState
export type AreaFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
}

// Type para las áreas con sus competencias 
export type AreaCompetenciasType = Areatype & {
  competencias: ( Omit<Competencia, 'createdAt' | 'updatedAt'> )[]
}