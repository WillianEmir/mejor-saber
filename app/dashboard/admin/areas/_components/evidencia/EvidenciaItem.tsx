'use client'

import ItemActionMenu from '../../../../../../src/components/ui/ItemActionMenu'
import { EvidenciaType } from '@/app/dashboard/admin/areas/_lib/evidencia.schema'
 
interface EvidenciaItemProps {
  evidencia: EvidenciaType
  onEdit: (evidencia: EvidenciaType) => void 
  onDelete: (id: string) => void 
}

export default function EvidenciaItem({ evidencia, onEdit, onDelete }: EvidenciaItemProps) {
  return (
    <li className="flex justify-between items-center py-2 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <span className="text-sm text-gray-700 dark:text-gray-300">{evidencia.nombre}</span>
      <ItemActionMenu 
        onEdit={() => onEdit(evidencia)}
        onDelete={() => onDelete(evidencia.id)}
      />
    </li>
  )
}
