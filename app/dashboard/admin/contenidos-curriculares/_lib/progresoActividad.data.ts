'use server'

import prisma from "@/src/lib/prisma";
import { ProgresoActividadInteractivaType } from "./progresoActividad.schema";

// Obtine el progreso de una actividad interactiva por su Id
export async function getProgresoActividadInteractivaById(id: string, usuarioId: string): Promise<ProgresoActividadInteractivaType | null> {
  try {
    const progresoActividadInteractiva = await prisma.progresoActividad.findUnique({
      where: {
        usuarioId_actividadId: {
          usuarioId,
          actividadId: id
        }
      },
    });
    return progresoActividadInteractiva;
  } catch (error) {
    console.error('Error de base de datos al obtener el progreso de la actividad interactiva:', error);
    throw new Error('No se pudo obtener el progreso de la actividad interactiva.');
  }
}