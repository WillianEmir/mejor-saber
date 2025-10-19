import prisma from "../prisma";
import { UserType } from "../schemas/user.schema";

// Obtiene todos los usuarios, para el panel Admin 
export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      omit: {
        password: true,
      },
    })
    return users;
  } catch (error) {
    console.error('Error al obtener los usuarios de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener los usuarios.');
  }
}

// Obtiene un usuario por su email
export async function getUserByEmail(email: string): Promise<UserType | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      omit: {
        password: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error al obtener el usuario de la base de datos:', error);
    throw new Error('Error de base de datos: No se pudo obtener el usuario.');
  }
};
