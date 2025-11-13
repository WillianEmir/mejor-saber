'use client' 

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

import EjeTematicoModal from './EjesTematicosModal'
import EjeTematicoHeader from './EjeTematicoHeader'
import EjeTematicoDetails from './EjeTematicoDetails'
import EjeTematicoObjetivos from './EjeTematicoObjetivos'
import SeccionesList from '../secciones/SeccionesList'
import { Button } from '@/src/components/ui/Button'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'

import { deleteEjeTematico } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.actions'
import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'

interface EjeTematicoViewProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export default function EjeTematicoView({ ejeTematico }: EjeTematicoViewProps) {

  const [isEjeModalOpen, setIsEjeModalOpen] = useState(false)
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleOpenEjeModal = () => setIsEjeModalOpen(true)
  const handleCloseEjeModal = () => setIsEjeModalOpen(false)

  const openDeleteDialog = () => setConfirmDeleteOpen(true)
  const closeDeleteDialog = () => setConfirmDeleteOpen(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEjeTematico(ejeTematico!.id)
      if (result.success) {
        toast.success(result.message)
        router.push('/dashboard/admin/contenidos-curriculares')
      } else {
        toast.error(result.message || 'Error al eliminar el eje temático')
      }
      closeDeleteDialog()
    })
  }

  return ( 
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="mb-6">
        <Link href='/dashboard/admin/contenidos-curriculares'>
          <Button variant='outline'>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contenidos
          </Button>
        </Link>
      </div>

      <EjeTematicoHeader
        ejeTematico={ejeTematico?.nombre}
        onEdit={handleOpenEjeModal}
        onDelete={openDeleteDialog}
      />

      <EjeTematicoDetails ejeTematico={ejeTematico} /> 

      <EjeTematicoObjetivos 
        ejeTematicoId={ejeTematico?.id}
        objetivosAprendizaje={ejeTematico?.objetivosAprendizaje}
      />

      <SeccionesList ejeTematico={ejeTematico} />

      <EjeTematicoModal
        isOpen={isEjeModalOpen}
        onClose={handleCloseEjeModal}
        contenidoCurricularId={ejeTematico!.contenidoCurricularId}
        ejeTematico={ejeTematico}
      />

      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que quieres eliminar este eje temático? Esta acción es irreversible y eliminará todo el contenido asociado."
        isPending={isPending}
      />
    </div>
  )
}