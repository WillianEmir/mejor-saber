'use client'

import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

import ItemActionMenu from './ItemActionMenu' 
import AfirmacionItem from './AfirmacionItem'
import { deleteAfirmacion } from '@/src/lib/actions/afirmacion.actions'
import AfirmacionModal from '../afirmacion-modal/AfirmacionModal'
import { CompetenciaType, CompetenciaWithRelations } from '@/src/lib/schemas/competencia.schema'
import { AfirmacionType } from '@/src/lib/schemas/afirmacion.schema'

interface CompetenciaItemProps { 
  competencia: CompetenciaWithRelations 
  onEdit: (competencia: CompetenciaType) => void 
  onDelete: (id: string) => void
}

export default function CompetenciaItem({ competencia, onEdit, onDelete }: CompetenciaItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAfirmacionModalOpen, setIsAfirmacionModalOpen] = useState(false)
  const [selectedAfirmacion, setSelectedAfirmacion] = useState<AfirmacionType | null>(null)

  const handleEditAfirmacion = (afirmacion: AfirmacionType) => {
    setSelectedAfirmacion(afirmacion)
    setIsAfirmacionModalOpen(true)
  }

  const handleAddAfirmacion = () => {
    setSelectedAfirmacion(null)
    setIsAfirmacionModalOpen(true)
  }

  const handleDeleteAfirmacion = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta afirmación?')) {
      const result = await deleteAfirmacion(id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar')
      }
    }
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-left">
            <ChevronRight
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{competencia.nombre}</h3>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleAddAfirmacion}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Agregar afirmación"
          >
            <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <ItemActionMenu
            onEdit={() => onEdit(competencia)}
            onDelete={() => onDelete(competencia.id)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {competencia.afirmaciones && competencia.afirmaciones.length > 0 ? (
            competencia.afirmaciones.map((afirmacion) => (
              <AfirmacionItem
                key={afirmacion.id}
                afirmacion={afirmacion}
                onEdit={handleEditAfirmacion}
                onDelete={handleDeleteAfirmacion}
              />
            ))
          ) : (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic py-4">No hay afirmaciones para esta competencia.</p>
          )}
        </div>
      )}

      <AfirmacionModal
        isOpen={isAfirmacionModalOpen}
        onClose={() => setIsAfirmacionModalOpen(false)}
        competenciaId={competencia.id}
        afirmacion={selectedAfirmacion}
      />
    </div>
  )
}
