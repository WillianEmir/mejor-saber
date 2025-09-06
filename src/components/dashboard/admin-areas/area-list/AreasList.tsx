'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FolderIcon } from '@heroicons/react/24/outline'

import type { Areatype } from '@/src/lib/schemas/area.schema'
import HeaderAreaList from './HeaderAreaList'
import AreaModal from '../area-view/AreaModal'

interface AreasListProps {
  areas: Areatype[]; 
}

export default function AreasList({ areas }: AreasListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddArea = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <HeaderAreaList onAddArea={handleAddArea} />

      <main className="mt-8">
        {areas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map(area => (
              <Link
                href={`/dashboard/admin/areas/${area.id}`}
                key={area.id}
                className="group relative flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                    <FolderIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {area.nombre}
                  </h2>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">No hay áreas creadas todavía.</h3>
            <p className="mt-2 text-sm text-gray-400">¡Comienza agregando una nueva área!</p>
          </div>
        )}
      </main>

      <AreaModal isOpen={isModalOpen} onClose={handleCloseModal} area={null} />
    </div>
  )
}