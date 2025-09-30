'use server'

import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import prisma from '../prisma'

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    throw new Error('Usuario no autenticado')
  }
  return session.user.id
}

export async function toggleSeccionProgreso(
  seccionId: string,
  path: string,
  isCompleted: boolean
) {
  const userId = await getUserId()

  await prisma.progresoSeccion.upsert({
    where: { usuarioId_seccionId: { usuarioId: userId, seccionId } },
    update: { completada: !isCompleted },
    create: { usuarioId: userId, seccionId, completada: true },
  })

  revalidatePath(path)
}

export async function toggleSubTemaProgreso(
  subTemaId: string,
  path: string,
  isCompleted: boolean
) {
  const userId = await getUserId()

  await prisma.progresoSubTema.upsert({
    where: { usuarioId_subTemaId: { usuarioId: userId, subTemaId } },
    update: { completado: !isCompleted },
    create: { usuarioId: userId, subTemaId, completado: true },
  })

  revalidatePath(path)
}

export async function toggleActividadProgreso(
  actividadId: string,
  path: string,
  isCompleted: boolean
) {
  const userId = await getUserId()

  await prisma.progresoActividad.upsert({
    where: { usuarioId_actividadId: { usuarioId: userId, actividadId } },
    update: { completado: !isCompleted, intentos: { increment: 1 } }, // Increment attempts on toggle
    create: { usuarioId: userId, actividadId, completado: true, intentos: 1 },
  })

  revalidatePath(path)
}
