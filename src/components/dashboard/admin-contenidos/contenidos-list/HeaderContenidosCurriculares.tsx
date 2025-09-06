'use client'

import { PlusIcon } from '@heroicons/react/24/outline'

interface HeaderContenidosCurricularesProps {
  onAddContenido: () => void;
}

export default function HeaderContenidosCurriculares({ onAddContenido }: HeaderContenidosCurricularesProps) {
  return (
    <header className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
      <div>
        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          Contenidos Curriculares
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Gestiona los contenidos curriculares y sus ejes temáticos.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddContenido}
        className="inline-flex items-center gap-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors duration-200"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Agregar Contenido</span>
      </button>
    </header>
  )
}
