import z from "zod";
import { EjeTematico } from "@/src/generated/prisma";
import { ObjetivoAprendizajeType } from "./objetivoAprendizaje.schema";
import { ContenidoCurricularType } from "./contenidoCurricular.schema";
import { Areatype } from "../../areas/_lib/area.schema";
import { SeccionWithRelationsType } from "./seccion.schema";

// Schema para la validación de los ejes temáticos 
export const EjeTematicoSchema = z.object({
  id: z.uuid({ message: 'El ID debe ser un UUID válido.' }).optional(),
  nombre: z.string().min(1, 'El nombre del eje temático no puede estar vacío.'),
  descripcionCorta: z.string().optional().nullable(),
  descripcionLarga: z.string().optional().nullable(),
  imagen: z.string().optional().nullable(),
  preguntaTematica: z.string().optional().nullable(),
  relevanciaICFES: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  orden: z.coerce.number().optional().nullable(),
  contenidoCurricularId: z.uuid({ message: 'El ID de contenido curricular debe ser un UUID válido.' }),
});

// Type para el Eje Temático
export type EjeTematicoType = Omit<EjeTematico, 'createdAt' | 'updatedAt'>;

// Type para el Eje Temático con sus relaciones
export type EjeTematicoWithRelationsType = EjeTematicoType & {
  contenidoCurricular: ContenidoCurricularType & {
    area: Areatype
  },
  objetivosAprendizaje: (ObjetivoAprendizajeType)[],
  secciones: (SeccionWithRelationsType)[]
} | null