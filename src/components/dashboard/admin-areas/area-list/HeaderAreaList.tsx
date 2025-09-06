'use client'

import { PlusIcon } from '@heroicons/react/24/outline'

interface HeaderAreaListProps {
  onAddArea: () => void;
}

export default function HeaderAreaList({ onAddArea }: HeaderAreaListProps) {
  return (
    <header className="sm:flex sm:items-center sm:justify-between pb-8 border-b border-gray-200 dark:border-gray-700">
      <div className="sm:flex-auto">
        <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
          Áreas de Conocimiento
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Gestiona las áreas de conocimiento que componen las pruebas.
        </p>
      </div>
      <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
        <button
          type="button"
          onClick={onAddArea}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
        >
          <PlusIcon className="w-5 h-5 -ml-0.5" />
          Agregar Área
        </button>
      </div>
    </header>
  )
}