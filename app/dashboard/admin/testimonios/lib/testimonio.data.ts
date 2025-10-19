import prisma from "@/src/lib/prisma";
import { TestimonioType, UserForSelect } from "./testimonio.schema";

// Obtiene todos los testimonios con datos del usuario asociado para el dashboard
export async function getTestimonios(): Promise<TestimonioType[] | null> {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return testimonios; 
  } catch (error) {
    return null;
  }
}

// Obtiene solo los testimonios publicados, para la landing page
export async function getPublicTestimonios(): Promise<TestimonioType[] | null> {
  try {
    const testimonios = await prisma.testimonio.findMany({
      where: { publicado: true },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return testimonios;
  } catch (error) {
    return null;
  }
}

// Obtiene una lista de usuarios para poblar el select del formulario
export async function getUsersForSelect(): Promise<UserForSelect[] | null> {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true, // Opcional: solo usuarios activos
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        firstName: "asc",
      }, 
    });
    return users;
  } catch (error) {
    return null;
  }
}

