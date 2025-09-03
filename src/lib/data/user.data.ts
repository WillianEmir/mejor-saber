import prisma from '@/src/lib/prisma';
import { UserForAdminType } from '../schemas/user.schema';

export async function getUsers(): Promise<UserForAdminType[]> {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
}