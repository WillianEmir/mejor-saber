import { auth } from "@/auth";
import prisma from "@/src/lib/prisma";

export async function getSchoolDataForUserManagement() {

  const session = await auth(); 

  if (!session || session?.user?.role !== 'ADMINSCHOOL') {
    return null;
  }

  const schoolId = session?.user?.schoolId; 

  if (!schoolId) return null;

  try {
    const school = await prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      select: {
        maxUsers: true,
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    return school;

  } catch (error) {
    console.error("Error fetching school data:", error);
    return null;
  }
}
