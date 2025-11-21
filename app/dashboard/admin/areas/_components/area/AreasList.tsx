'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FolderIcon } from '@heroicons/react/24/outline'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import AreaModal from './AreaModal'
import AreaListHeader from './AreaListHeader'

import type { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'

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
      <AreaListHeader onAddArea={handleAddArea} />

      <main className="mt-8">
        {areas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {areas.map(area => (
              <Link
                href={`/dashboard/admin/areas/${area.id}`}
                key={area.id}
                className="group" // Remove direct styling from Link, let Card handle it
              >
                <Card className="h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                      <FolderIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {area.nombre}
                    </CardTitle>
                  </CardHeader>
                  {/* Add CardContent if there's more content for each area */}
                  {/* <CardContent>
                    <p>Some description or details about the area.</p>
                  </CardContent> */}
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-gray-500 dark:text-gray-400">No hay áreas creadas todavía.</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mt-2 text-sm text-gray-400">¡Comienza agregando una nueva área!</p>
            </CardContent>
          </Card>
        )}
      </main>

      <AreaModal isOpen={isModalOpen} onClose={handleCloseModal} area={null} />
    </div>
  )
}