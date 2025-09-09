import { z } from 'zod'; 
import { Area, ContenidoCurricular, EjeTematico } from '@/src/generated/prisma'; 

export const ContenidoCurricularSchema = z.object({
  id: z.uuid({error: 'El ID debe ser un UUID válido.'}).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.' ), 
  areaId: z.uuid({error: 'El ID de área debe ser un UUID válido.'}) 
});

// Type para los contenidos curriculares
export type ContenidoCurricularType = Omit<ContenidoCurricular, 'createdAt' | 'updatedAt'>;

// Type para los contenidos curriculares con sus relaciones
export type ContenidoWithRelationsType = ContenidoCurricularType & {
  area: (
    Omit<Area, 'createdAt' | 'updatedAt'>
  ),
  ejesTematicos: (
    Omit<EjeTematico, 'createdAt' | 'updatedAt'>
  )[]
}

// Tipo para el estado del formulario que será usado por useFormState
export type ContenidoCurricularFormState = {
  errors?: {
    nombre?: string[];
  }; 
  message?: string | null;
} 

