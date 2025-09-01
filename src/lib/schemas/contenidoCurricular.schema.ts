import { z } from 'zod';
import { AreaSchema } from './area.schema';

export const ContenidoCurricularSchema = z.object({
  id: z.uuid({error: 'El ID debe ser un UUID válido.'}).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.' ),
  areaId: z.uuid({error: 'El ID de área debe ser un UUID válido.'})
});

export type ContenidoCurricularType = z.infer<typeof ContenidoCurricularSchema>;

// Tipo para el estado del formulario que será usado por useFormState
export type ContenidoCurricularFormState = {
  errors?: {
    nombre?: string[];
  };
  message?: string | null;
} 

const ContenidoAreaSchema = ContenidoCurricularSchema.extend({
  area: z.lazy(() => AreaSchema)
});

export type ContenidoAreaType = z.infer<typeof ContenidoAreaSchema>;