import { FormState } from "@/src/types";
import { EjeTematicoType } from "./ejeTematico.schema";
import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProgresoActividadInteractivaSchema } from "./progresoActividad.schema";

export async function createOrUpdateProgresoActividad( formData: FormData ): Promise<FormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = ProgresoActividadInteractivaSchema.safeParse({
    id: formData.get('id') || undefined,
    completado: formData.get('completado') === 'true',
    intentos: formData.get('intentos'),
    usuarioId: formData.get('usuarioId'),
    actividadId: formData.get('actividadId'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...progresoData } = validatedFields.data;

  try {
    if (id) {
      await prisma.progresoActividad.update({
        where: { id },
        data: progresoData,
      });
    } else {
      await prisma.progresoActividad.create({
        data: progresoData,
      });
    }
  } catch (e) {
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  const ejeTematicoId = formData.get('ejeTematicoId') as string;
  if (!ejeTematicoId) {
    return { message: 'Error: El ID del eje temático es requerido.', success: false};
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
  return { message: id ? 'Progreso de la Actividad actualizado exitosamente.' : 'Progreso de la Actividad  creado exitosamente.', success: true};
}

export async function deleteProgresoActividad(id: string, ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.progresoActividad.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`);
    return { message: 'Progreso de la Actividad eliminado exitosamente.', success: true}
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar la actividad.', success: false};
  }
}