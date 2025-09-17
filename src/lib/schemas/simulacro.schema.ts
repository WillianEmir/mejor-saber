import { Simulacro, SimulacroPregunta } from '@/src/generated/prisma';
import { z } from 'zod';

export const SimulacroPreguntaSchema = z.object({
  preguntaId: z.uuid({ error: 'El ID de la pregunta debe ser un UUID válido.' }),
  opcionSeleccionadaId: z.uuid({ error: 'El ID de la opción seleccionada debe ser un UUID válido.' }),
  correcta: z.boolean()
})

export type SimulacroPreguntaType = SimulacroPregunta;

export const SimulacroSchema = z.object({
  score: z.number().min(0).max(100),
  duracionMinutos: z.number().min(0),
  userId: z.uuid({ error: 'El ID del usuario debe ser un UUID válido.' }),
  competenciaId: z.uuid({ error: 'El ID de la competencia debe ser un UUID válido.' }),
  preguntas: z.array(SimulacroPreguntaSchema)
})

export type SimulacroType = Omit<Simulacro, 'createdAt'>;