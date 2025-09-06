'use client'

import { useRouter, usePathname } from 'next/navigation';
import { PencilIcon } from '@heroicons/react/24/outline'

// Types
import type { AreaWithRelationsType } from '@/src/lib/schemas/area.schema';

interface ButtonEditAreaProps {
  area: AreaWithRelationsType;
}

export default function ButtonEditArea({ area }: ButtonEditAreaProps) {
  
  const router = useRouter(); 
  const pathname = usePathname();

  const handleEdit = () => {
    const params = new URLSearchParams();
    params.set('edit-area', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button onClick={() => handleEdit()} className="inline-flex items-center gap-x-1.5 rounded-md bg-yellow-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-yellow-500" aria-label={`Editar ${area?.nombre}`}>
      <PencilIcon className="h-4 w-4" />
      Editar
    </button>
  )
}
