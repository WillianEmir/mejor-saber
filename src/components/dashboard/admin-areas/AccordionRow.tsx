import {TrashIcon, ChevronRightIcon, PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import React from 'react'

// Componente de Fila Mejorado con Funcionalidad de Acordeón
export const AccordionRow = ({
  item,
  level,
  hasChildren,
  isOpen,
  childType,
  onToggle,
  onAddChild,
  onEdit,
  onDelete,
}: {
  item: { id: string; nombre: string };
  level: number;
  hasChildren: boolean;
  isOpen: boolean;
  childType?: string;
  onToggle: (id: string) => void;
  onAddChild: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const indentation = level * 24; // 24px de indentación por nivel

  return (
    <div className="flex items-center justify-between p-3 text-sm border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* --- Lado Izquierdo: Expansor y Nombre --- */}
      <button
        type="button"
        onClick={() => hasChildren && onToggle(item.id)}
        className="flex items-center flex-1 min-w-0 text-left"
        style={{ paddingLeft: `${indentation}px` }}
        disabled={!hasChildren}
      >
        {hasChildren ? (
          <ChevronRightIcon
            className={`w-5 h-5 mr-2 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
          />
        ) : (
          <span className="w-5 h-5 mr-2" /> // Espaciador para alinear
        )}
        <span className="font-medium text-gray-900 dark:text-white">{item.nombre}</span>
      </button>

      {/* --- Lado Derecho: Acciones --- */}
      <div className="flex items-center ml-4 space-x-2">

        {level !== 3 && (
          <button
            onClick={(e) => { e.stopPropagation(); onAddChild(item.id); }}
            className="p-1 text-green-600 rounded-md hover:bg-gray-200 dark:text-green-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={`Agregar ${childType} a ${item.nombre}`}
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item.id); }}
          className="p-1 text-indigo-600 rounded-md hover:bg-gray-200 dark:text-indigo-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label={`Editar ${item.nombre}`}
        >
          <PencilIcon className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="p-1 text-red-600 rounded-md hover:bg-gray-200 dark:text-red-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label={`Eliminar ${item.nombre}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
