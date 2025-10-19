import 'server-only';

import prisma from '../prisma';
import { ActividadInteractivaType, ProgresoActividadInteractivaType } from '../schemas/actividadInteractiva.schema';
import { EjeTematicoType, SeccionType } from '../../../app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema';

// ----- ********************* ----- //
// ----- ACTIVIDAD INTERACTIVA ----- //
// ----- ********************* ----- //

// Obtiene todas las actividades interactivas
export async function getActividadesInteractivas(): Promise<ActividadInteractivaType[] | null> {
  try {
    const actividadesInteractivas = await prisma.actividadInteractiva.findMany({
      orderBy: { nombre: 'asc' },
    });
    return actividadesInteractivas;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}

// Obtine una actividad interactiva por su Id
export async function getActividadInteractivaById(id: ActividadInteractivaType['id']): Promise<ActividadInteractivaType | null> {
  try {
    const actividadInteractiva = await prisma.actividadInteractiva.findUnique({
      where: { id },
    });
    return actividadInteractiva;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}

// Obtine las actividades interactivas de una sección de un eje temático
export async function getActividadInteractivaBySeccionId(id: SeccionType['id']): Promise<ActividadInteractivaType[] | null> {
  try {
    const actividadesInteractivas = await prisma.actividadInteractiva.findMany({
      where: { id },
      orderBy: { nombre: 'asc' },
    });
    return actividadesInteractivas;
  } catch (error) {
    console.error('Error de base de datos al obtener las actividades interactivas:', error);
    throw new Error('No se pudieron obtener las actividades interactivas.');
  }
}

// ----- ****************************** ----- //
// ----- PROGRESO ACTIVIDAD INTERACTIVA ----- //
// ----- ****************************** ----- //

// Obtine el progreso de una actividad interactiva por su Id
export async function getProgresoActividadInteractivaById(id: ActividadInteractivaType['id'], usuarioId: string): Promise<ProgresoActividadInteractivaType | null> {
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
