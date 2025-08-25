import { getAreas } from '@/src/lib/data/areas.data';

// Types 
import type { Areatype } from '@/src/lib/schemas/area.schema';
import Link from 'next/link';
import AreaModalAdd from './AreaModal';
import HeaderAreaList from './HeaderAreaList';
import { Suspense } from 'react'; 

export default async function AreasList() { 

  const areas: Areatype[] = await getAreas(); 

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      
      <HeaderAreaList />

      <main className="mt-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {areas.map(area => (
            <Link
              href={`/dashboard/admin/areas/${area.id}`}
              key={area.id} 
              className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {area.nombre}
              </h2>
            </Link>
          ))}
        </div>
      </main>

      <Suspense >
        <AreaModalAdd />
      </Suspense>
    </div>
  );
}
