'use client'

import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { AccordionContent, AccordionItem } from "@/src/components/ui/accordion"
import { Button } from '@/src/components/ui/Button'
import { AfirmacionType, AfirmacionWithEvidencias } from '@/app/dashboard/admin/areas/_lib/afirmacion.schema'
import { EvidenciaType } from '@/app/dashboard/admin/areas/_lib/evidencia.schema'

import ItemActionMenu from '../../../../../../src/components/ui/ItemActionMenu'
import EvidenciaItem from '../evidencia/EvidenciaItem'
import EvidenciaModal from '../evidencia/EvidenciaModal'

interface AfirmacionItemProps {
  afirmacion: AfirmacionWithEvidencias
  onEditAfirmacion: (afirmacion: AfirmacionType) => void
  onDeleteAfirmacion: (id: string) => void
  onDeleteEvidencia: (id: string) => void
}

export default function AfirmacionItem({  
  afirmacion, 
  onEditAfirmacion, 
  onDeleteAfirmacion,
  onDeleteEvidencia
}: AfirmacionItemProps) {
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

  return (
    <AccordionItem value={afirmacion.id} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg">
      <AccordionPrimitive.Header className="flex items-center w-full px-4 py-3">
        <AccordionPrimitive.Trigger className="flex flex-1 items-center text-md font-medium text-gray-800 dark:text-gray-200 hover:underline [&[data-state=open]>svg]:rotate-180">
          {afirmacion.nombre}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
        </AccordionPrimitive.Trigger>
        <div className="flex items-center gap-2 pl-4">
          <Button variant="ghost" size="sm" onClick={handleAddEvidencia}>
            <Plus className="h-4 w-4 mr-1" />
            Añadir Evidencia
          </Button>
          <ItemActionMenu
            onEdit={() => onEditAfirmacion(afirmacion)}
            onDelete={() => onDeleteAfirmacion(afirmacion.id)}
          />
        </div>
      </AccordionPrimitive.Header>
      <AccordionContent className="px-4 pb-3">
        {afirmacion.evidencias && afirmacion.evidencias.length > 0 ? (
          <ul className="space-y-2 list-inside text-gray-600 dark:text-gray-400 border-l-2 border-gray-200 dark:border-gray-700 pl-4 ml-2">
            {afirmacion.evidencias.map((evidencia) => (
              <EvidenciaItem
                key={evidencia.id}
                evidencia={evidencia}
                onEdit={handleEditEvidencia}
                onDelete={onDeleteEvidencia}
              />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 italic pl-6">No hay evidencias para esta afirmación.</p>
        )}
      </AccordionContent>

      <EvidenciaModal
        isOpen={isEvidenciaModalOpen}
        onClose={() => setIsEvidenciaModalOpen(false)}
        afirmacionId={afirmacion.id}
        evidencia={selectedEvidencia}
      />
    </AccordionItem>
  )
}
