import { z } from 'zod';
import { ContenidoCurricularSchema } from './contenidoCurricular.schema';
import { EvidenciaSchema } from './evidencia.schema';
import { AfirmacionSchema } from './afirmacion.schema';
import { CompetenciaSchema } from './competencia.schema';
import { AreaSchema } from './area.schema';

export const OpcionRespuestaSchema = z.object({
  respuesta: z.string().min(1, { message: 'La respuesta no puede estar vacía.' }),
  correcta: z.preprocess((val) => val === 'on', z.boolean()),
  retroalimentacion: z.string().nullable(),
});

export const PreguntaSchema = z.object({
  id: z.uuid({ error: 'El ID debe ser un UUID válido.' }).optional(),
  contexto: z.string().min(1, { message: 'El contexto no puede estar vacío.' }),
  imagen: z.string().optional().nullable(),
  enunciado: z.string().min(1, { message: 'El enunciado no puede estar vacío.' }),
  opciones: z.array(OpcionRespuestaSchema),
  evidenciaId: z.string().min(1, { message: 'El ID de la evidencia no puede estar vacío.' }),
  contenidosCurriculares: z.union([
      z.array(z.string().uuid({ message: 'Cada ID de contenido curricular debe ser un UUID válido.' })),
      z.array(ContenidoCurricularSchema),
    ]).refine((arr) => arr.length >= 1, { message: 'Debe haber al menos un contenido curricular.' }),
});

export type PreguntaType = z.infer<typeof PreguntaSchema>;

// Tipo para el estado del formulario que será usado por useFormState
export type PreguntaFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}