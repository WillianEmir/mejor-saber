'use client'

import Link from 'next/link'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'

interface AreaViewHeaderProps {
  areaName: string
  onAddCompetencia: () => void
  onEditArea: () => void
  onDeleteArea: () => void
}

export default function AreaViewHeader({ 
  areaName,
  onAddCompetencia,
  onEditArea,
  onDeleteArea,
}: AreaViewHeaderProps) {
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="mb-6">
        <Link href="/dashboard/admin/areas" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Volver a las Áreas</span>
        </Link>
      </div>
      <header className="sm:flex sm:items-start sm:justify-between pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="sm:flex-auto">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
            {areaName}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Gestiona las competencias, afirmaciones y evidencias de esta área.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <button onClick={onEditArea} className='flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors'>
            <Pencil className='h-4 w-4'/>
            Editar Área
          </button>
          <button onClick={onDeleteArea} className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors'>
            <Trash2 className='h-4 w-4'/>
            Eliminar
          </button>
        </div>
      </header>
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
          Competencias
        </h2>
        <button onClick={onAddCompetencia} className='flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors'>
          <Plus className='h-5 w-5'/>
          Añadir Competencia
        </button>
      </div>
    </div>
  )
}
