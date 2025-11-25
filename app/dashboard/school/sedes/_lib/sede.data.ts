'use server'

import { auth } from '@/auth' // Updated import
import prisma from '@/src/lib/prisma'

export const getSedesBySchool = async () => {
  const session = await auth() // Updated call
  if (!session?.user?.schoolId) {
    return []
  }

  try {
    const sedes = await prisma.schoolSede.findMany({
      where: {
        schoolId: session.user.schoolId,
      },
    })
    return sedes
  } catch (error) {
    console.error(error)
    return []
  }
}