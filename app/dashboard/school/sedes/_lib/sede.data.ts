'use server'

import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '@/src/lib/prisma'
import { getServerSession } from 'next-auth'

export const getSedesBySchool = async () => {
  const session = await getServerSession(authOptions)
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
