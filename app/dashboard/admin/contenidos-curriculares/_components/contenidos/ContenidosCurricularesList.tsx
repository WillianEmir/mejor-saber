'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Plus, ChevronDown } from 'lucide-react'
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { deleteEjeTematico } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.actions'
import { deleteContenidoCurricular } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.actions'

import { Accordion, AccordionContent, AccordionItem } from '@/src/components/ui/accordion'
import ItemActionMenu from '@/src/components/ui/ItemActionMenu'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'
import { Button } from '@/src/components/ui/Button'
import ContenidosCurricularesModal from './ContenidosCurricularesModal'
import EjeTematicoModal from '../ejes/EjesTematicosModal'
import ContenidosCurricularesHeader from './ContenidosCurricularesHeader'

import type { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'
import type { ContenidoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.schema'
import type { EjeTematicoType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { FormState } from '@/src/types'

interface ContenidosCurricularesListProps { 
  areas: Areatype[]
  contenidosCurriculares: ContenidoWithRelationsType[]
}

type DialogState = {
  isOpen: boolean
  id: string | null
  type: 'contenido' | 'eje' | null
}

export default function ContenidosCurricularesList({ areas, contenidosCurriculares }: ContenidosCurricularesListProps) {

  const [isPending, startTransition] = useTransition()

  const [isContenidoModalOpen, setIsContenidoModalOpen] = useState(false)
  const [isEjeModalOpen, setIsEjeModalOpen] = useState(false)
  const [dialogState, setDialogState] = useState<DialogState>({ isOpen: false, id: null, type: null })

  const [selectedEje, setSelectedEje] = useState<EjeTematicoType | null>(null)
  const [selectedContenido, setSelectedContenido] = useState<ContenidoWithRelationsType | null>(null)
  const [selectedContenidoId, setSelectedContenidoId] = useState<string>('')

  const openDialog = (id: string, type: DialogState['type']) => {
    setDialogState({ isOpen: true, id, type })
  }

  const closeDialog = () => {
    setDialogState({ isOpen: false, id: null, type: null })
  }

  const handleAddContenido = () => {
    setSelectedContenido(null)
    setIsContenidoModalOpen(true)
  }

  const handleEditContenido = (contenido: ContenidoWithRelationsType) => {
    setSelectedContenido(contenido)
    setIsContenidoModalOpen(true)
  }

  const handleDelete = () => {
    if (!dialogState.id || !dialogState.type) return

    let action: (id: string) => Promise<FormState>

    switch (dialogState.type) {
      case 'contenido':
        action = deleteContenidoCurricular
        break
      case 'eje':
        action = deleteEjeTematico
        break
      default:
        return
    }

    startTransition(async () => {
      const result = await action(dialogState.id!)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      closeDialog()
    })
  }

  const handleCloseContenidoModal = () => {
    setIsContenidoModalOpen(false)
    setSelectedContenido(null)
  }

  const handleAddEje = (contenidoId: string) => {
    setSelectedEje(null)
    setSelectedContenidoId(contenidoId)
    setIsEjeModalOpen(true)
  }

  const handleEditEje = (eje: EjeTematicoType) => {
    setSelectedEje(eje)
    setSelectedContenidoId(eje.contenidoCurricularId!)
    setIsEjeModalOpen(true)
  }

  const handleCloseEjeModal = () => {
    setIsEjeModalOpen(false)
    setSelectedEje(null)
    setSelectedContenidoId('')
  }

  const dialogMessages = {
    contenido: {
      title: '¿Estás seguro de que quieres eliminar este contenido curricular?',
      description: 'Esta acción no se puede deshacer. Se eliminará el contenido y todo su contenido asociado (ejes temáticos, subtemas, etc).',
    },
    eje: {
      title: '¿Estás seguro de que quieres eliminar este eje temático?',
      description: 'Esta acción no se puede deshacer. Se eliminará el eje temático y todo su contenido asociado (subtemas, etc).',
    },
  }

  const getDialogContent = () => {
    if (!dialogState.type) return { title: '', description: '' }
    return dialogMessages[dialogState.type]
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      <ContenidosCurricularesHeader onAddContenido={handleAddContenido} />

      <main className="py-4">
        {contenidosCurriculares && contenidosCurriculares.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {contenidosCurriculares.map(contenido => (
              <AccordionItem
                value={`item-${contenido.id}`}
                key={contenido.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <AccordionPrimitive.Header className="flex items-center justify-between w-full px-4 py-2">
                  <AccordionPrimitive.Trigger className="flex flex-1 items-center text-left font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">
                        {contenido.nombre}
                      </span>
                      <p className="ml-2 text-sm text-gray-600 dark:text-gray-400 bg-lime-200 dark:bg-lime-700 p-0.5 rounded-md">
                        {contenido.area.nombre}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
                  </AccordionPrimitive.Trigger>
                  <div className="flex items-center gap-2 pl-4">
                    <Button variant="outline" size="sm" onClick={() => handleAddEje(contenido.id!)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Eje Temático
                    </Button>
                    <ItemActionMenu
                      onEdit={() => handleEditContenido(contenido)}
                      onDelete={() => openDialog(contenido.id!, 'contenido')}
                    />
                  </div>
                </AccordionPrimitive.Header>
                <AccordionContent className="p-4 space-y-2">
                  {contenido.ejesTematicos && contenido.ejesTematicos.length > 0 ? (
                    <ul className="space-y-1 list-inside text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
                      {contenido.ejesTematicos.map(eje => (
                        <li
                          key={eje.id}
                          className="flex justify-between items-center px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          <Link
                            href={`/dashboard/admin/contenidos-curriculares/${eje.id}`}
                            className="flex-1"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {eje.nombre}
                            </p>
                          </Link>
                          <ItemActionMenu
                            onEdit={() => handleEditEje(eje)}
                            onDelete={() => openDialog(eje.id!, 'eje')}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic py-4">
                      No hay ejes temáticos para este contenido.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No hay Contenidos Curriculares
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aún no se han agregado contenidos curriculares.
            </p>
          </div>
        )}
      </main>

      <ContenidosCurricularesModal
        isOpen={isContenidoModalOpen}
        onClose={handleCloseContenidoModal}
        contenidoCurricular={selectedContenido}
        areas={areas}
      />

      <EjeTematicoModal
        isOpen={isEjeModalOpen}
        onClose={handleCloseEjeModal}
        contenidoCurricularId={selectedContenidoId}
        ejeTematico={selectedEje}
      />

      <ConfirmationDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        onConfirm={handleDelete}
        title={getDialogContent().title}
        description={getDialogContent().description}
        isPending={isPending}
      />
    </div>
  )
}
