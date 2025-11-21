import prisma from "@/src/lib/prisma";
import { UserType } from "@/app/dashboard/admin/users/_lib/user.schema";

// Action to fetch a single user by ID (for admin panel)
export async function getUserById(id: string): Promise<UserType | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    // Explicitly select all fields except 'password' to ensure it's never exposed
    select: {
      id: true,
      idDocument: true,
      email: true,
      name: true,
      lastName: true,
      address: true,
      department: true,
      city: true,
      isActive: true,
      image: true,
      phone: true,
      degree: true,
      activationDate: true,
      createdAt: true,
      updatedAt: true,
      role: true,
      schoolId: true,
      schoolSedeId: true,
      lastLogin: true, 
      emailVerified: true,
      password: false,
    },
  });
  return user;
}