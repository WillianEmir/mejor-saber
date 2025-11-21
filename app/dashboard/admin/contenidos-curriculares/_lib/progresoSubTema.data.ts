'use server'

import prisma from "@/src/lib/prisma";
import { ProgresoSubTemaType } from "./progresoSubTema.schema";

// Obtine el progreso de un subtema por su Id
export async function getProgresoSubtemaById(id: string, usuarioId: string): Promise<ProgresoSubTemaType | null> {
  try {
    const progresoSubTema = await prisma.progresoSubTema.findUnique({
      where: {
        usuarioId_subTemaId: {
          usuarioId,
          subTemaId: id
        }
      },
    });
    return progresoSubTema;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error('No se pudo obtener el progreso del subtema.');
    }
    throw new Error('No se pudo obtener el progreso del subtema.');
  }
}