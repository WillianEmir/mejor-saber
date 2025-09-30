'use client'
import { EjeTematicoWithRelationsType } from '@/src/lib/schemas/ejeTematico.schema'
import EjeTematicoModal from '../eje-tematico-modal/EjesTematicosModal'
import EjeTematicoHeader from './EjeTematicoHeader'
import EjeTematicoDetails from './EjeTematicoDetails'
import EjeTematicoObjetivos from './EjeTematicoObjetivos'
import { useState } from 'react'
import SeccionesList from './SeccionesList'
import Link from 'next/link'
import { Button } from '@/src/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { deleteEjeTematico } from '@/src/lib/actions/ejeTematico.action'

interface EjeTematicoViewProps {
  ejeTematico: EjeTematicoWithRelationsType 
}

export default function EjeTematicoView({ ejeTematico }: EjeTematicoViewProps) {
  const [isEjeModalOpen, setIsEjeModalOpen] = useState(false)

  const router = useRouter()

  const handleOpenEjeModal = () => {
    setIsEjeModalOpen(true)
  }

  const handleCloseEjeModal = () => {
    setIsEjeModalOpen(false)
  }

  const handleDeleteEjeTematico = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este eje temático y todo su contenido asociado?')) {
      const result = await deleteEjeTematico(ejeTematico.id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
        router.push('/dashboard/admin/contenidos-curriculares')
      } else {
        toast.error(result?.message || 'Error al eliminar el eje temático')
      }
    }
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
        ejeTematico={ejeTematico}
        onEdit={handleOpenEjeModal}
        onDeleteEjeTematico={handleDeleteEjeTematico}
      />

      <EjeTematicoDetails ejeTematico={ejeTematico} />

      <EjeTematicoObjetivos
        ejeTematico={ejeTematico}
      />

      <SeccionesList ejeTematico={ejeTematico} />

      {isEjeModalOpen && (
        <EjeTematicoModal
          isOpen={isEjeModalOpen}
          onClose={handleCloseEjeModal}
          contenidoCurricularId={ejeTematico.contenidoCurricularId}
          ejeTematico={ejeTematico}
        />
      )}
    </div>
  )
}
