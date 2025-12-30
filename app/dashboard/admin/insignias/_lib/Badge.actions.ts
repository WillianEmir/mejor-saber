"use server";

import { revalidatePath } from "next/cache";
import { badgeSchema } from "./Badge.schema";
import * as z from "zod";
import prisma from "@/src/lib/prisma";

export async function createBadge(values: z.infer<typeof badgeSchema>) {
  try {
    const validatedFields = badgeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Campos inválidos!" };
    }

    const { name, description, iconUrl, criteria } = validatedFields.data;

    await prisma.badge.create({
      data: {
        name,
        description,
        iconUrl,
        criteria,
      },
    });

    revalidatePath("/dashboard/admin/insignias");
    return { success: "Insignia creada!" };
  } catch (error) {
    console.error("Error al crear insignia:", error);
    return { error: "Error interno del servidor." };
  }
}

export async function updateBadge(id: string, values: z.infer<typeof badgeSchema>) {
  try {
    const validatedFields = badgeSchema.safeParse(values);

    if (!validatedFields.success) {
      return { error: "Campos inválidos!" };
    }

    const { name, description, iconUrl, criteria } = validatedFields.data;

    await prisma.badge.update({
      where: { id },
      data: {
        name,
        description,
        iconUrl,
        criteria,
      },
    });

    revalidatePath("/dashboard/admin/insignias");
    return { success: "Insignia actualizada!" };
  } catch (error) {
    console.error(`Error al actualizar insignia con ID ${id}:`, error);
    return { error: "Error interno del servidor." };
  }
}

export async function deleteBadge(id: string) {
  try {
    await prisma.badge.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/insignias");
    return { success: "Insignia eliminada!" };
  } catch (error) {
    console.error(`Error al eliminar insignia con ID ${id}:`, error);
    return { error: "Error interno del servidor." };
  }
}
