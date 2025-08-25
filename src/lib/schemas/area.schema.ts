import { z } from 'zod';
import { AfirmacionSchema } from './afirmacion.schema';
import { CompetenciaSchema } from './competencia.schema';
import { EvidenciaSchema } from './evidencia.schema';


// Esquema de validación para la creación/edición de un Área
export const AreaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  nombre: z.string({ error: 'El nombre es obligatorio.' }).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});

// Type para las áreas
export type Areatype = z.infer<typeof AreaSchema>;

// Esquema para las áreas con todas sus relaciones 
export const AreaWithRelationsSchema = AreaSchema.extend({
  competencias: z.array(
    CompetenciaSchema.extend({
      afirmaciones: z.array(
        AfirmacionSchema.extend({
          evidencias: z.array(EvidenciaSchema),
        })
      ),
    })
  ),
});

// Type para las áreas con todas sus relaciones
export type AreaWithRelationsType = z.infer<typeof AreaWithRelationsSchema>;

// Tipo para el estado del formulario que será usado por useFormState
export type AreaFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
}
