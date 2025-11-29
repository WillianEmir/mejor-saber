'use server'

import prisma from "@/src/lib/prisma";
import { UpsertUserType, UserType } from "./user.schema";

// Obtiene todos los usuarios, para el panel Admin 
export async function getDashboardAdminUsers () : Promise<UpsertUserType[]> {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        schoolId: true,
        lastLogin: true
      }
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
