import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";
import { UserSchoolType } from "./user.schema";

export async function getUsersBySchoolId() : Promise<UserSchoolType[]> {

  const session = await auth(); 

  if (!session || session?.user?.role !== 'ADMINSCHOOL') {
    return [];
  }

  const schoolId = session?.user?.schoolId;

  try {
    const users1 = await prisma.user.findMany({
      where: {
        schoolId: schoolId!,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        idDocument: true,
        schoolId: true,
        role: true,
        degree: true,
        schoolSedeId: true,
      }
    });

    const users = users1.map((user) => {
      const { schoolSedeId, ...rest } = user;
      return { ...rest, sedeName: schoolSedeId || null };
    });

    return users
  } catch (error) {
    console.error("Error fetching users by school ID:", error);
    return [];
  }
}