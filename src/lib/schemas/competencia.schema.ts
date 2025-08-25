import { z } from 'zod';

// Esquema de validación para la creación/edición de una Competencia
export const CompetenciaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  areaId: z.string({error: 'El id del área es obligatorio.'}),
  nombre: z.string({error: 'El nombre de la competencia es obligatorio.'}).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
});
 
// Type para las competencias
export type CompetenciaType = z.infer<typeof CompetenciaSchema>;

// Tipo para el estado del formulario que será usado por useFormState
export type CompetenciaFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
}
