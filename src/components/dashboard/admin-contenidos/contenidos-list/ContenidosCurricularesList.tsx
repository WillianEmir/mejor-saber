'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { Plus } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion'
import type { Areatype } from '@/src/lib/schemas/area.schema'
import type { ContenidoWithRelationsType } from '@/src/lib/schemas/contenidoCurricular.schema'
import type { EjeTematicoType } from '@/src/lib/schemas/ejeTematico.schema'
import { deleteEjeTematico } from '@/src/lib/actions/ejeTematico.action'
import { deleteContenidoCurricular } from '@/src/lib/actions/contenidosCurricular.action'

import HeaderContenidosCurriculares from './HeaderContenidosCurriculares'
import ContenidosCurricularesModal from '../ContenidosCurricularesModal'
import EjeTematicoModal from '../EjesTematicosModal'
import ItemActionMenu from '../../admin-areas/area-view/ItemActionMenu'

interface ContenidosCurricularesListProps {
  areas: Areatype[]
  contenidosCurriculares: ContenidoWithRelationsType[]
}

export default function ContenidosCurricularesList({
  areas,
  contenidosCurriculares,
}: ContenidosCurricularesListProps) {
  const [isContenidoModalOpen, setIsContenidoModalOpen] = useState(false)
  const [isEjeModalOpen, setIsEjeModalOpen] = useState(false)
  const [selectedEje, setSelectedEje] = useState<EjeTematicoType | null>(null)
  const [selectedContenido, setSelectedContenido] =
    useState<ContenidoWithRelationsType | null>(null)
  const [selectedContenidoId, setSelectedContenidoId] = useState<string>('')

  const handleAddContenido = () => {
    setSelectedContenido(null)
    setIsContenidoModalOpen(true)
  }

  const handleEditContenido = (contenido: ContenidoWithRelationsType) => {
    setSelectedContenido(contenido)
    setIsContenidoModalOpen(true)
  }

  const handleDeleteContenido = async (id: string) => {
    if (
      confirm('¿Estás seguro de que quieres eliminar este contenido curricular?')
    ) {
      const result = await deleteContenidoCurricular(id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar')
      }
    }
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

  const handleDeleteEje = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este eje temático?')) {
      const result = await deleteEjeTematico(id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar')
      }
    }
  }

  const handleCloseEjeModal = () => {
    setIsEjeModalOpen(false)
    setSelectedEje(null)
    setSelectedContenidoId('')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <HeaderContenidosCurriculares onAddContenido={handleAddContenido} />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {contenidosCurriculares && contenidosCurriculares.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {contenidosCurriculares.map((contenido) => (
              <AccordionItem
                value={`item-${contenido.id}`}
                key={contenido.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between w-full p-4 text-left">
                  <AccordionTrigger className="p-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {contenido.nombre}
                      </h3>
                      <p className="ml-2 text-sm text-gray-600 dark:text-gray-400 bg-lime-200 dark:bg-lime-700 p-0.5 rounded-md">
                        {contenido.area.nombre}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => handleAddEje(contenido.id!)}
                      className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                      aria-label="Agregar Eje Temático"
                    >
                      <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <ItemActionMenu
                      onEdit={() => handleEditContenido(contenido)}
                      onDelete={() => handleDeleteContenido(contenido.id!)}
                    />
                  </div>
                </div>
                <AccordionContent className="p-4 space-y-2 pb-25">
                  {contenido.ejesTematicos &&
                  contenido.ejesTematicos.length > 0 ? (
                    <ul className="space-y-1 list-inside text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
                      {contenido.ejesTematicos.map((eje) => (
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
                            onDelete={() => handleDeleteEje(eje.id!)}
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
    </div>
  )
}
