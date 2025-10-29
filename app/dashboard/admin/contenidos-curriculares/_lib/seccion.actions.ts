'use server'

import prisma from "@/src/lib/prisma";
import { FormState } from "@/src/types";
import { revalidatePath } from "next/cache";
import { SeccionSchema, SeccionType } from "./seccion.schema";
import { EjeTematicoType } from "./ejeTematico.schema";

export async function createOrUpdateSeccion(formData: FormData): Promise<FormState> {

  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SeccionSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    tipo: formData.get('tipo'),
    ejeTematicoId: formData.get('ejeTematicoId'),
  });
  
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { id, ...seccionData } = validatedFields.data;

  try {
    if (id) {
      await prisma.seccion.update({
        where: { id },
        data: seccionData,
      });
    } else {
      await prisma.seccion.create({
        data: seccionData,
      });
    }
  } catch (e) {
    if (e instanceof Error && e.message.includes('Unique constraint failed')) {
      return {
        success: false,
        message: 'Error: El nombre ya está en uso.',
        errors: { nombre: ['Ya existe una sección con este nombre en este contenido curricular.'] },
      };
    }
    return {
      success: false,
      message: 'Error de base de datos: No se pudo procesar la solicitud.'
    };
  }

  revalidatePath(`/dashboard/admin/contenidos-curriculares/${seccionData.ejeTematicoId}`);
  return { message: id ? 'Sección actualizada exitosamente.' : 'Sección creada exitosamente.', success: true};
}

export async function deleteSeccion(id: SeccionType['id'], ejeTematicoId: EjeTematicoType['id']): Promise<FormState> {
  try {
    await prisma.seccion.delete({ where: { id } });
    revalidatePath(`/dashboard/admin/contenidos-curriculares/${ejeTematicoId}`)
    return { message: 'Sección eliminada exitosamente.', success: true}
  } catch (e) {
    return { message: 'Error de base de datos: No se pudo eliminar la sección.', success: false};
  }
}