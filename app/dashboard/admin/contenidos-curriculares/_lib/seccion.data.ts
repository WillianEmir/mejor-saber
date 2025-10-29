'use server'

import prisma from "@/src/lib/prisma";
import { SeccionType } from "./seccion.schema";
import { EjeTematicoType } from "./ejeTematico.schema";

// Obtiene todas las secciones
export async function getSecciones(): Promise<SeccionType[] | null> {
  try {
    const secciones = await prisma.seccion.findMany({
      orderBy: { nombre: 'asc' },
    });
    return secciones;
  } catch (error) {
    console.error('Error de base de datos al obtener las secciones:', error);
    throw new Error('No se pudieron obtener las secciones.');
  }
}

// Obtine una sección por su Id
export async function getSeccionById(id: SeccionType['id']): Promise<SeccionType | null> {
  try {
    const seccion = await prisma.seccion.findUnique({
      where: { id },
    });
    return seccion;
  } catch (error) {
    console.error('Error de base de datos al obtener el Eje Temático:', error);
    throw new Error('No se pudo obtener el Eje Temático.');
  }
}

// Obtine las secciones de un eje temático
export async function getSeccionByEjeTematicoId(id: EjeTematicoType['id']): Promise<SeccionType[] | null> {
  try {
    const secciones = await prisma.seccion.findMany({
      where: { ejeTematicoId: id },
      orderBy: { nombre: 'asc' },
    });
    return secciones;
  } catch (error) {
    console.error('Error de base de datos al obtener los Ejes Temáticos:', error);
    throw new Error('No se pudo obtener los Ejes Temáticos.');
  }
}