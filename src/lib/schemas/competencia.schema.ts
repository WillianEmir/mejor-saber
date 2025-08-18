import { z } from 'zod';

// Esquema de validación para la creación/edición de una Competencia
export const CompetenciaSchema = z.object({
  id: z.string().optional(), // Opcional, solo presente en edición
  nombre: z.string({error: 'El nombre es obligatorio.'}).trim().min(3, { message: 'El nombre debe tener al menos 3 caracteres.' }),
  areaId: z.string({error: 'El id del área es obligatoria.'})
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
