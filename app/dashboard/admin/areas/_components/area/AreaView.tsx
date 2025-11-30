'use client'

import { useState, useTransition } from 'react' 
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { deleteArea } from '@/app/dashboard/admin/areas/_lib/area.actions'
import { deleteCompetencia } from '@/app/dashboard/admin/areas/_lib/competencia.actions'
import { deleteAfirmacion } from '@/app/dashboard/admin/areas/_lib/afirmacion.actions'
import { deleteEviencia } from '@/app/dashboard/admin/areas/_lib/evidencia.actions'
import { type CompetenciaType } from '@/app/dashboard/admin/areas/_lib/competencia.schema'
import { type AreaWithRelationsType, type Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'
import { type FormState } from '@/src/types'

import { Accordion } from "@/src/components/ui/accordion"
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'
import AreaViewHeader from './AreaViewHeader'
import AreaModal from './AreaModal'
import CompetenciaModal from '../competencia/CompetenciaModal'
import CompetenciaItem from '../competencia/CompetenciaItem'

interface AreaViewProps { 
  area: AreaWithRelationsType 
}

type DialogState = {
  isOpen: boolean 
  id: string | null
  type: 'area' | 'competencia' | 'afirmacion' | 'evidencia' | null
}

export default function AreaView({ area }: AreaViewProps) {

  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<Areatype>()

  const [isCompetenciaModalOpen, setIsCompetenciaModalOpen] = useState(false)
  const [selectedCompetencia, setSelectedCompetencia] = useState<CompetenciaType | null>(null) //TODO: Verifiar este null

  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, id: null, type: null })

  const openDialog = (id: string, type: DialogState['type']) => {
    setDialogState({ isOpen: true, id, type })
  }

  const closeDialog = () => {
    setDialogState({ isOpen: false, id: null, type: null })
  }

  const handleEditArea = () => {
    setSelectedArea(area)
    setIsAreaModalOpen(true)
  }

  const handleDelete = () => {
    if (!dialogState.id || !dialogState.type) return

    startTransition(async () => {
      let result: FormState

      switch (dialogState.type) {
        case 'area':
          result = await deleteArea(dialogState.id!)
          break
        case 'competencia':
          result = await deleteCompetencia(dialogState.id!, area.id)
          break
        case 'afirmacion':
          result = await deleteAfirmacion(dialogState.id!, area.id)
          break
        case 'evidencia':
          result = await deleteEviencia(dialogState.id!, area.id)
          break
        default:
          return
      }

      if (result.success) {
        toast.success(result.message)
        if (dialogState.type === 'area') {
          router.push('/dashboard/admin/areas')
        }
      } else {
        toast.error(result.message)
      }
      closeDialog()
    })
  }

  const handleAddCompetencia = () => {
    setSelectedCompetencia(null)
    setIsCompetenciaModalOpen(true)
  }

  const handleEditCompetencia = (competencia: CompetenciaType) => {
    setSelectedCompetencia(competencia)
    setIsCompetenciaModalOpen(true)
  }

  const dialogMessages = {
    area: {
      title: '¿Estás seguro de que quieres eliminar esta área?',
      description: 'Esta acción no se puede deshacer. Se eliminará el área y todo su contenido asociado (competencias, afirmaciones, evidencias).',
    },
    competencia: {
      title: '¿Estás seguro de que quieres eliminar esta competencia?',
      description: 'Esta acción no se puede deshacer. Se eliminará la competencia y todo su contenido asociado (afirmaciones, evidencias).',
    },
    afirmacion: {
      title: '¿Estás seguro de que quieres eliminar esta afirmación?',
      description: 'Esta acción no se puede deshacer. Se eliminará la afirmación y todo su contenido asociado (evidencias).',
    },
    evidencia: {
      title: '¿Estás seguro de que quieres eliminar esta evidencia?',
      description: 'Esta acción no se puede deshacer.',
    },
  }

  const getDialogContent = () => {
    if (!dialogState.type) return { title: '', description: '' }
    return dialogMessages[dialogState.type]
  }

  return (
    <>
      <AreaViewHeader
        areaName={area.nombre}
        onAddCompetencia={handleAddCompetencia}
        onEditArea={handleEditArea}
        onDeleteArea={() => openDialog(area.id, 'area')}
        isPending={isPending}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {area.competencias && area.competencias.length > 0 ? (
          <Accordion type="multiple" className="space-y-6">
            {area.competencias.map((competencia) => (
              <CompetenciaItem
                key={competencia.id}
                competencia={competencia}
                onEditCompetencia={handleEditCompetencia}
                onDeleteCompetencia={(id) => openDialog(id, 'competencia')}
                onDeleteAfirmacion={(id) => openDialog(id, 'afirmacion')}
                onDeleteEvidencia={(id) => openDialog(id, 'evidencia')}
              />
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay competencias</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado competencias para esta área.</p>
          </div>
        )}
      </main>

      <AreaModal
        isOpen={isAreaModalOpen}
        onClose={() => setIsAreaModalOpen(false)}
        area={selectedArea}
      />

      <CompetenciaModal
        isOpen={isCompetenciaModalOpen}
        onClose={() => setIsCompetenciaModalOpen(false)}
        areaId={area.id}
        competencia={selectedCompetencia}
      />

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
        title={getDialogContent().title}
        description={getDialogContent().description}
      />
    </>
  )
}
