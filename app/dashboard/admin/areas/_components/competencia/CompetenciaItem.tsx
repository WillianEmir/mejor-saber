'use client'

import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { type CompetenciaType, type CompetenciaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/competencia.schema'
import { type AfirmacionType } from '@/app/dashboard/admin/areas/_lib/afirmacion.schema'

import { AccordionContent, AccordionItem } from "@/src/components/ui/accordion"
import { Button } from '@/src/components/ui/Button'
import AfirmacionItem from '../afirmacion/AfirmacionItem'
import AfirmacionModal from '../afirmacion/AfirmacionModal' 
import ItemActionMenu from '@/src/components/ui/ItemActionMenu'

interface CompetenciaItemProps {
  competencia: CompetenciaWithRelationsType
  onEditCompetencia: (competencia: CompetenciaType) => void
  onDeleteCompetencia: (id: string) => void
  onDeleteAfirmacion: (id: string) => void
  onDeleteEvidencia: (id: string) => void 
}

export default function CompetenciaItem({ competencia, onEditCompetencia, onDeleteCompetencia, onDeleteAfirmacion, onDeleteEvidencia }: CompetenciaItemProps) {

  const [isAfirmacionModalOpen, setIsAfirmacionModalOpen] = useState(false)
  const [selectedAfirmacion, setSelectedAfirmacion] = useState<AfirmacionType | null>(null) // TODO: Verificar este null

  const handleEditAfirmacion = (afirmacion: AfirmacionType) => {
    setSelectedAfirmacion(afirmacion)
    setIsAfirmacionModalOpen(true)
  }

  const handleAddAfirmacion = () => {
    setSelectedAfirmacion(null)
    setIsAfirmacionModalOpen(true) 
  }

  return (
    <AccordionItem value={competencia.id} className="bg-white dark:bg-gray-800 rounded-md shadow">
      <AccordionPrimitive.Header className="flex items-center w-full px-6 py-4">
        <AccordionPrimitive.Trigger className="flex flex-1 items-center text-lg font-medium text-gray-900 dark:text-white hover:underline [&[data-state=open]>svg]:rotate-180">
          {competencia.nombre}
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
        </AccordionPrimitive.Trigger>
        <div className="flex items-center gap-2 pl-4">
          <Button variant="outline" size="sm" onClick={handleAddAfirmacion}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Afirmación
          </Button>
          <ItemActionMenu
            onEdit={() => onEditCompetencia(competencia)}
            onDelete={() => onDeleteCompetencia(competencia.id)}
          />
        </div>
      </AccordionPrimitive.Header>
      <AccordionContent className="px-6 pb-4">
        {competencia.afirmaciones && competencia.afirmaciones.length > 0 ? (
          <AccordionPrimitive.Root type="multiple" className="space-y-4">
            {competencia.afirmaciones.map((afirmacion) => (
              <AfirmacionItem
                key={afirmacion.id}
                afirmacion={afirmacion}
                onEditAfirmacion={handleEditAfirmacion}
                onDeleteAfirmacion={onDeleteAfirmacion}
                onDeleteEvidencia={onDeleteEvidencia}
              />
            ))}
          </AccordionPrimitive.Root>
        ) : (
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic py-4">No hay afirmaciones para esta competencia.</p>
        )}
      </AccordionContent>

      <AfirmacionModal
        isOpen={isAfirmacionModalOpen}
        onClose={() => setIsAfirmacionModalOpen(false)}
        competenciaId={competencia.id}
        afirmacion={selectedAfirmacion}
      />
    </AccordionItem>
  )
}
