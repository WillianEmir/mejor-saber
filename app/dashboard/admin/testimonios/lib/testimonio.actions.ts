"use server";

import prisma from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { TestimonialSchema, TestimonioSchema } from "./testimonio.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export type TestimonioFormState = {
  message: string;
  errors?: {
    rating?: string[];
    comentario?: string[];
    publicado?: string[];
    userId?: string[];
  };
};

export async function createOrUpdateTestimonio(
  prevState: TestimonioFormState,
  formData: FormData
): Promise<TestimonioFormState> {  
   
  const validatedFields = TestimonioSchema.safeParse({
    id: formData.get("id"),
    rating: formData.get("rating"),
    comentario: formData.get("comentario"),
    publicado: formData.get("publicado") === "true" ? true : false,
    userId: formData.get("userId"),
  });  
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Por favor, corrija los campos.",
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    if (id) {
      await prisma.testimonio.update({
        where: { id },
        data,
      });
    } else {
      await prisma.testimonio.create({
        data, 
      });
    }
  } catch (e) {
    return {
      message: "Error de base de datos: No se pudo procesar la solicitud.",
    };
  }  
  
  revalidatePath("/dashboard/admin/testimonios");
  return { message: id ? "Testimonio actualizado exitosamente." : "Testimonio creado exitosamente." };
}

export async function deleteTestimonio( id: string ): Promise<{ message: string } | void> {
  if (!id) return { message: "ID de testimonio no válido." };
  try {
    await prisma.testimonio.delete({ where: { id } });
    revalidatePath("/dashboard/admin/testimonios");
    return { message: "Testimonio eliminado exitosamente." };
  } catch (e) {
    return { message: "Error de base de datos: No se pudo eliminar el testimonio." };
  }
}

// El usuario autenticado puede crear un testimonio desde la página principal
export async function createTestimonial(data: FormData) {
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      success: false,
      message: 'No estás autenticado.',
    };
  }

  const validatedFields = TestimonialSchema.safeParse({
    rating: Number(data.get('rating')),
    comentario: data.get('comentario'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Datos inválidos.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.testimonio.create({
      data: {
        ...validatedFields.data,
        userId: session.user.id,
      },
    });
    revalidatePath('/');
    return {
      success: true,
      message: 'Testimonio creado con éxito.',
    };
  } catch (error) {
    return {
      success: false,
      message: 'No se pudo crear el testimonio.',
    };
  }
}