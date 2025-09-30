import prisma from '@/src/lib/prisma';
import { UserType } from '../schemas/user.schema';

// Action to fetch all users (for admin panel)
export async function getUsers(): Promise<UserType[]> {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    // Explicitly select all fields except 'password' to ensure it's never exposed
    select: {
      id: true,
      idDocument: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      department: true,
      city: true,
      isActive: true,
      avatar: true,
      phone: true,
      degree: true,
      activationDate: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      schoolId: true,
      schoolSedeId: true,
    },
  });
  return users;
}

// Action to fetch a single user by ID (for admin panel)
export async function getUserById(id: string): Promise<UserType | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    // Explicitly select all fields except 'password' to ensure it's never exposed
    select: {
      id: true,
      idDocument: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      department: true,
      city: true,
      isActive: true,
      avatar: true,
      phone: true,
      degree: true,
      activationDate: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      schoolId: true,
      schoolSedeId: true,
    },
  });
  return user;
}
// Action to fetch all users by School ID (for admin school panel)
export async function getUserBySchoolId(schoolId: string): Promise<UserType[] | null> {
  const user = await prisma.user.findMany({
    where: { schoolId },
    // Explicitly select all fields except 'password' to ensure it's never exposed
    select: {
      id: true,
      idDocument: true,
      email: true,
      firstName: true,
      lastName: true,
      address: true,
      department: true,
      city: true,
      isActive: true,
      avatar: true,
      phone: true,
      degree: true,
      activationDate: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      schoolId: true,
      schoolSedeId: true,
    },
  });
  
  if (user.length === 0) {
    return null;
  }

  return user;
} 