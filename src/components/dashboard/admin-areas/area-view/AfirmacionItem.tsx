'use client'

import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { toast } from 'react-toastify'

import ItemActionMenu from './ItemActionMenu'
import EvidenciaItem from './EvidenciaItem'
import { deleteEviencia } from '@/src/lib/actions/evidencia.actions'
import EvidenciaModal from '../evidencia-modal/EvidenciaModal'
import { AfirmacionType, AfirmacionWithEvidencias } from '@/src/lib/schemas/afirmacion.schema'
import { EvidenciaType } from '@/src/lib/schemas/evidencia.schema'

interface AfirmacionItemProps {
  afirmacion: AfirmacionWithEvidencias
  onEdit: (afirmacion: AfirmacionType) => void
  onDelete: (id: string) => void
}

export default function AfirmacionItem({ afirmacion, onEdit, onDelete }: AfirmacionItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEvidenciaModalOpen, setIsEvidenciaModalOpen] = useState(false)
  const [selectedEvidencia, setSelectedEvidencia] = useState<EvidenciaType | null>(null)

  const handleEditEvidencia = (evidencia: EvidenciaType) => {
    setSelectedEvidencia(evidencia)
    setIsEvidenciaModalOpen(true)
  }

  const handleAddEvidencia = () => {
    setSelectedEvidencia(null)
    setIsEvidenciaModalOpen(true)
  }

  const handleDeleteEvidencia = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta evidencia?')) {
      const result = await deleteEviencia(id)
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar')
      }
    }
  }

  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-left">
            <ChevronRight
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{afirmacion.nombre}</h4>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleAddEvidencia}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Agregar evidencia"
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </button>
          <ItemActionMenu 
            onEdit={() => onEdit(afirmacion)}
            onDelete={() => onDelete(afirmacion.id)}
          />
        </div>
      </div> 

      {isOpen && (
        <div className="pl-6 mt-3">
          {afirmacion.evidencias && afirmacion.evidencias.length > 0 ? (
            <ul className="space-y-1 list-inside text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
              {afirmacion.evidencias.map((evidencia) => (
                <EvidenciaItem 
                  key={evidencia.id} 
                  evidencia={evidencia} 
                  onEdit={handleEditEvidencia}
                  onDelete={handleDeleteEvidencia}
                />
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-4">No hay evidencias.</p>
          )}
        </div>
      )}

      <EvidenciaModal 
        isOpen={isEvidenciaModalOpen}
        onClose={() => setIsEvidenciaModalOpen(false)}
        afirmacionId={afirmacion.id}
        evidencia={selectedEvidencia}
      />
    </div>
  )
}
