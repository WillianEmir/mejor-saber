'use server'

import { FormState } from "@/src/types";
import { SchoolSedeSchema } from "./sede.schema";
import { revalidatePath } from "next/cache";
import prisma from "@/src/lib/prisma";
 
export async function createOrUpdateSchoolSede( formData: FormData ): Promise<FormState> {
  
  // 1. Extraer y validar los datos del formulario del lado del servidor
  const validatedFields = SchoolSedeSchema.safeParse({
    id: formData.get('id') || undefined,
    nombre: formData.get('nombre'),
    DANE: formData.get('DANE'),
    schoolId: formData.get('schoolId'),
  });
  
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Error de validación. Por favor, corrija los campos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
 
  const { id, ...schoolSededData } = validatedFields.data;

  try {
    if (id) {
      await prisma.schoolSede.update({
        where: { id },
        data: schoolSededData,
      });
    } else {
      await prisma.schoolSede.create({
        data: schoolSededData,
      });
    }
  } catch (e) {
    return {
      message: `Error de base de datos: No se pudo procesar la solicitud. ${e}`,
      success: false,
    };
  }

  revalidatePath('/dashboard/admin/schools');
  return { message: id ? 'Sede actualizada exitosamente.' : 'Sede creada exitosamente.', success: true};
}

export async function deleteSchoolSede(id: string ): Promise<FormState> {
  try {
    await prisma.schoolSede.delete({ where: { id } });
    revalidatePath('/dashboard/admin/schools')
    return {message: 'Sede eliminada exitosamente.', success: true}
  } catch (e) { 
    if (e instanceof Error) {
      return { message: e.message, success: false};
    }
    return { message: 'Error de base de datos: No se pudo procesar la solicitud.', success: false};
  } 
}