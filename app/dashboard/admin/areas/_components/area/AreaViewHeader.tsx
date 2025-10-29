'use client'

import Link from 'next/link'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/src/components/ui/Button'

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
          <Button onClick={onEditArea} variant='outline'>
            <Pencil className='h-4 w-4 mr-2'/>
            Editar Área
          </Button>
          <Button onClick={onDeleteArea} variant='destructive'>
            <Trash2 className='h-4 w-4 mr-2'/>
            Eliminar
          </Button>
        </div>
      </header>
      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
          Competencias
        </h2>
        <Button onClick={onAddCompetencia}>
          <Plus className='h-5 w-5 mr-2'/>
          Añadir Competencia
        </Button>
      </div>
    </div>
  )
}
