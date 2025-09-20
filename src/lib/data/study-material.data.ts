'use server';
import prisma from '@/src/lib/prisma';

export async function getAllAreasWithContenidos() {
  try {
    const areas = await prisma.area.findMany({
      include: {
        contenidosCurriculares: {
          include: {
            ejesTematicos: {
              orderBy: {
                nombre: 'asc',
              },
            },
          },
          orderBy: {
            nombre: 'asc',
          },
        },
      },
      orderBy: { 
        nombre: 'asc',
      }
    });
    return areas;
  } catch (error) {
    console.error("Error fetching areas with contenidos:", error);
    return [];
  }
}

export async function getEjeTematicoWithPreguntas(id: string) {
  try {
    const ejeTematico = await prisma.ejeTematico.findUnique({
      where: { id },
      include: {
        preguntas: {
          include: {
            opciones: true,
          },
        },
        contenidoCurricular: {
          include: {
            area: true,
          }
        }
      },
    });
    return ejeTematico;
  } catch (error) {
    console.error(`Error fetching eje tematico with id ${id}:`, error);
    return null;
  }
}