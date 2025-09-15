import prisma from '@/src/lib/prisma';
import { UserType } from '../schemas/user.schema';

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
    },
  });
  return users;
}
