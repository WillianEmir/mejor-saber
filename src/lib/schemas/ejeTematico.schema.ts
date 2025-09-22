import { EjeTematico, ProgresoSeccion, Seccion, TipoSeccion } from "@/src/generated/prisma";
import z, { float32 } from "zod";

// ----- ************ ----- //
// ----- EJE TEMÁTICO ----- //
// ----- ************ ----- //

// Schema para la validación de los ejes temáticos 
export const EjeTematicoSchema = z.object({
  id: z.uuid({message: 'El ID debe ser un UUID válido.'}).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcionCorta: z.string().optional().nullable(),
  descripcionLarga: z.string().optional().nullable(),
  imagen: z.string().optional().nullable(),
  preguntaTematica: z.string().optional().nullable(),
  relevanciaICFES: z.string().optional().nullable(),
  video: z.string().optional().nullable(),
  orden: z.coerce.number().optional().nullable(),
  contenidoCurricularId: z.uuid({message: 'El ID de contenido curricular debe ser un UUID válido.'}),
}); 

// Type para los Ejes Temáticos
export type EjeTematicoType = Omit<EjeTematico, 'createdAt' | 'updatedAt'>;

// Tipo para el estado del formulario que será usado por useFormState
export type EjeTematicoFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
} 

// ----- ******* ----- //
// ----- SECCION ----- //
// ----- ******* ----- //

// schema para validar cada sección
export const SeccionSchema = z.object({
  id: z.uuid({message: 'El ID debe ser un UUID válido.'}).optional(),
  nombre: z.string().min(1, 'El nombre no puede estar vacío.'),
  descripcion: z.string().optional().nullable(),
  orden: z.number().optional().nullable(),
  tipo: z.enum(TipoSeccion),
  ejeTematicoId: z.uuid({message: 'El ID del eje temático debe ser un UUID válido.'})
})

// Type para las secciones
export type SeccionType = Omit<Seccion, 'createdAt' | 'updatedAt'>;

// Tipo para el estado del formulario que será usado por useFormState
export type SeccionFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}

// ----- **************** ----- //
// ----- PROGRESO SECCION ----- //
// ----- **************** ----- //

// schema para la validación del Progreso de una sección
export const ProgresoSeccionSchema = z.object({
  id: z.uuid({message: 'El ID debe ser un UUID válido.'}).optional(),
  avance: float32().min(0),
  completada: z.boolean(),
  usuarioId: z.uuid({message: 'El ID del usuario debe ser un UUID válido.'}),
  seccionId: z.uuid({message: 'El ID de la sección debe ser un UUID válido.'})
})

// Type para el Progreso de una sección
export type ProgresoSeccionType = Omit<ProgresoSeccion, 'createdAt' | 'updatedAt'>;

// Tipo para el estado del formulario que será usado por useFormState
export type ProgresoSeccionFormState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
}