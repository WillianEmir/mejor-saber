import prisma from "@/src/lib/prisma";
import { UpdateProfileType } from "./profile.schema";

export async function getUserProfileById(id: string): Promise<UpdateProfileType | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      idDocument: true,
      name: true,
      lastName: true,
      address: true,
      department: true,
      city: true,
      image: true,
      phone: true,
    },
  });
  return user;
}

export async function isUserPassword(id: string) : Promise<boolean> { 
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      password: true,
    },
  });

  const isPasswordPresent = !!user?.password;

  return isPasswordPresent;
}