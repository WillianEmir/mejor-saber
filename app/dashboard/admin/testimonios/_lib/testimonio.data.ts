import prisma from "@/src/lib/prisma";
import { TestimonioType, UserForSelect } from "./testimonio.schema";

const ITEMS_PER_PAGE = 10;

type searchConditionType = {
  OR: [
    { user: { name: { contains: string; mode: "insensitive"; } } },
    { user: { lastName: { contains: string; mode: "insensitive" } } },
    { user: { email: { contains: string; mode: "insensitive" } } }
  ]
} | object

// Obtiene todos los testimonios con datos del usuario asociado para el dashboard
export async function getTestimonios(query: string | undefined, currentPage: number): Promise<TestimonioType[]> {
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const searchCondition: searchConditionType = query ? {
    OR: [
      { user: { name: { contains: query, mode: "insensitive" as const } } },
      { user: { lastName: { contains: query, mode: "insensitive" as const } } },
      { user: { email: { contains: query, mode: "insensitive" as const } } },
    ],
  } : {};

  try {
    const testimonios = await prisma.testimonio.findMany({
      take: ITEMS_PER_PAGE,
      skip: skip,
      where: searchCondition,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return testimonios;
  } catch (error) {
    console.error("Error obteniendo los Testimonios", error);
    throw new Error("No se pudieron obtener los Testimonios.");
  }
}

export async function getTestimoniosCount(query: string | undefined): Promise<number> {
  const searchCondition: searchConditionType = query ? {
    OR: [
      { user: { name: { contains: query, mode: "insensitive" as const } } },
      { user: { lastName: { contains: query, mode: "insensitive" as const } } },
      { user: { email: { contains: query, mode: "insensitive" as const } } },
    ],
  } : {};

  try {
    const count = await prisma.testimonio.count({
      where: searchCondition,
    });
    return count;
  } catch (error) {
    console.error("Error contando los Testimonios", error);
    throw new Error("No se pudo contar los Testimonios.");
  }
}

// Obtiene solo los testimonios publicados, para la landing page
export async function getPublicTestimonios(): Promise<TestimonioType[]> {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { publicado: true },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return testimonios;
  } catch (error) {
    console.error('Error obteniendo los Testimonios', error);
    throw new Error('No se pudieron obtener los Testimonios.');
  }
}

// Obtiene una lista de usuarios para poblar el select del formulario
export async function getUsersForSelect(): Promise<UserForSelect[]> {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true, // Opcional: solo usuarios activos
      },
      select: {
        id: true,
        name: true,
        lastName: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return users;
  } catch (error) {
    console.error('Error obteniendo los Usuarios', error);
    throw new Error('No se pudieron obtener los Usuarios');
  }
}
