import { OpcionPregunta, Pregunta, Simulacro, SimulacroPregunta } from "@/src/generated/prisma";
import z from "zod";

// Schema para validar la pregunta y la opción seleccionada
export const SimulacroPreguntaSchema = z.object({
  preguntaId: z.uuid({ error: 'El ID de la pregunta debe ser un UUID válido.' }),
  opcionSeleccionadaId: z.uuid({ error: 'El ID de la opción seleccionada debe ser un UUID válido.' }),
  correcta: z.boolean()
})

// Schema para validar el simulacro
export const SimulacroSchema = z.object({
  score: z.number().min(0).max(100),
  duracionMinutos: z.number().min(0),
  userId: z.uuid({ error: 'El ID del usuario debe ser un UUID válido.' }),
  competenciaId: z.uuid({ error: 'El ID de la competencia debe ser un UUID válido.' }),
  preguntas: z.array(SimulacroPreguntaSchema)
})

// Type para el simulacro
export type SimulacroType = Simulacro;

// Type para la pregunta y la opción seleccionada
export type SimulacroPreguntaType = SimulacroPregunta;

// Type para el simulacro con relaciones
export type SimulacroWithRelationsType = SimulacroType & {
  competencia: {
    area: { nombre: string };
    nombre: string;
  };
};

// Type para el resultado de una pregunta del simulacro
export type SimulacroResultType = SimulacroPregunta & {
  pregunta: (
    Pregunta & { opciones: OpcionPregunta[]  }
  ),
  opcionSeleccionada: ( OpcionPregunta ) | null
}
