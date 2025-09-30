"use server"; 

import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";
import * as z from "zod";
import bcryptjs from "bcryptjs";
import prisma from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const ChangePasswordSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Helper para validar el archivo
const validateFile = (file: File) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 800 * 1024; // 800K

  if (!allowedTypes.includes(file.type)) {
    return "Tipo de archivo no permitido. Sube un JPG, PNG o GIF.";
  }
  if (file.size > maxSize) {
    return "El archivo es demasiado grande. El tamaño máximo es de 800K.";
  }
  return null;
};

export async function updateUserAvatar(
  formData: FormData,
  remove: boolean = false
) {
  const userId = formData.get("userId") as string;

  if (!userId) {
    return { success: false, error: "ID de usuario no proporcionado." };
  }

  try {
    // Si se solicita eliminar la foto
    if (remove) {
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: null },
      });

      revalidatePath("/dashboard/profile");
      return { success: true };
    }

    const avatarFile = formData.get("avatar") as File;

    if (!avatarFile || avatarFile.size === 0) {
      return { success: false, error: "No se ha subido ningún archivo." };
    }

    // Validar archivo
    const validationError = validateFile(avatarFile);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // Procesar y guardar el archivo
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Crear un nombre de archivo único para evitar colisiones
    const fileExtension = avatarFile.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    const path = join(process.cwd(), "public", "images", "user", fileName);

    await writeFile(path, buffer);

    const avatarUrl = `/images/user/${fileName}`;

    // Actualizar el usuario en la base de datos
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar el avatar:", error);
    return {
      success: false,
      error: "Ocurrió un error en el servidor al actualizar la foto de perfil.",
    };
  }
}

export async function changePassword( values: z.infer<typeof ChangePasswordSchema>) {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: "No autenticado" };
  }

  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || !user.password) {
    return { error: "Usuario no encontrado" };
  }

  const passwordsMatch = await bcryptjs.compare(currentPassword, user.password);

  if (!passwordsMatch) {
    return { error: "La contraseña actual es incorrecta" };
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: "Contraseña actualizada correctamente" };
}
