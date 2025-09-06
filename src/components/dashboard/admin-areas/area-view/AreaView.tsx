'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import { notFound, useRouter } from 'next/navigation'

import { AreaWithRelationsType, Areatype } from '@/src/lib/schemas/area.schema'
import { CompetenciaType } from '@/src/lib/schemas/competencia.schema'
import { deleteArea } from '@/src/lib/actions/area.actions'
import { deleteCompetencia } from '@/src/lib/actions/competencia.actions'

import AreaViewHeader from './AreaViewHeader'
import CompetenciaItem from './CompetenciaItem'
import AreaModal from './AreaModal'
import CompetenciaModal from '../competencia-modal/CompetenciaModal'

interface AreaViewProps {
  area: AreaWithRelationsType 
} 

export default function AreaView({ area }: AreaViewProps) {
  const router = useRouter()

  // Area Modal State
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<Areatype | null>(null)

  // Competencia Modal State
  const [isCompetenciaModalOpen, setIsCompetenciaModalOpen] = useState(false)
  const [selectedCompetencia, setSelectedCompetencia] = useState<CompetenciaType | null>(null)

  if (!area) notFound(); // Or a not found component

  // Handlers for Area
  const handleEditArea = () => {
    setSelectedArea(area)
    setIsAreaModalOpen(true)
  }

  const handleDeleteArea = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta área y todo su contenido asociado?')) {
      const result = await deleteArea(area.id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
        router.push('/dashboard/admin/areas')
      } else {
        toast.error(result?.message || 'Error al eliminar el área')
      }
    }
  }

  // Handlers for Competencia
  const handleAddCompetencia = () => {
    setSelectedCompetencia(null)
    setIsCompetenciaModalOpen(true)
  }

  const handleEditCompetencia = (competencia: CompetenciaType) => {
    setSelectedCompetencia(competencia)
    setIsCompetenciaModalOpen(true)
  }

  const handleDeleteCompetencia = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta competencia?')) {
      const result = await deleteCompetencia(id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar la competencia')
      }
    }
  }

  return (
    <>
      <AreaViewHeader  
        areaName={area.nombre}
        onAddCompetencia={handleAddCompetencia}
        onEditArea={handleEditArea}
        onDeleteArea={handleDeleteArea}
      />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {area.competencias && area.competencias.length > 0 ? (
            area.competencias.map((competencia) => (
              <CompetenciaItem 
                key={competencia.id} 
                competencia={competencia}
                onEdit={handleEditCompetencia}
                onDelete={handleDeleteCompetencia}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay competencias</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado competencias para esta área.</p>
            </div>
          )}
        </div>
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
    </>
  )
}
