'use client'

import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'

import type { ContenidoWithRelationsType } from '@/src/lib/schemas/contenidoCurricular.schema'
import type { EjeTematicoType } from '@/src/lib/schemas/ejeTematico.schema'

import ItemActionMenu from '../../admin-areas/area-view/ItemActionMenu'
import EjeTematicoItem from '../ejes-tematicos-list/EjeTematicoItem'

interface ContenidoCurricularItemProps {
  contenidoCurricular: ContenidoWithRelationsType;
  onEdit: (contenido: ContenidoWithRelationsType) => void;
  onDelete: (id: string) => void;
  onAddEje: (contenidoId: string) => void;
  onEditEje: (eje: EjeTematicoType) => void;
  onDeleteEje: (id: string) => void;
}

export default function ContenidoCurricularItem({
  contenidoCurricular,
  onEdit,
  onDelete,
  onAddEje,
  onEditEje,
  onDeleteEje,
}: ContenidoCurricularItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-left">
            <ChevronRight
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{contenidoCurricular.nombre}</h3>
          </button>
          <p className='ml-2 text-sm text-gray-600 dark:text-gray-400 bg-lime-200 dark:bg-lime-700 p-0.5 rounded-md '>{contenidoCurricular.area.nombre}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddEje(contenidoCurricular.id!)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Agregar Eje Temático"
          >
            <Plus className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <ItemActionMenu
            onEdit={() => onEdit(contenidoCurricular)}
            onDelete={() => onDelete(contenidoCurricular.id!)}
          />
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {contenidoCurricular.ejesTematicos && contenidoCurricular.ejesTematicos.length > 0 ? (

            <ul className="space-y-1 list-inside text-gray-600 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700 pl-4">
              {contenidoCurricular.ejesTematicos.map((eje) => (
              <EjeTematicoItem
                key={eje.id}
                eje={eje}
                onEdit={onEditEje}
                onDelete={onDeleteEje}
              />
            ))}
            </ul>

          ) : (
            <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic py-4">
              No hay ejes temáticos para este contenido.
            </p>
          )}
        </div>
      )}
    </div>
  );
}