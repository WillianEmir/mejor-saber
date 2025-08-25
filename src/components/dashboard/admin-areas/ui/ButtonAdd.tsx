'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter } from 'next/navigation';

interface ButtonAddProps {
  textAdd?: string;
  textParams?: string;
} 

export default function ButtonAdd({textAdd, textParams} : ButtonAddProps) { 

  const router = useRouter();
  const pathname = usePathname(); 

  const handleAdd = () => {
    const params = new URLSearchParams();
    params.set(`add-${textParams}`, 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <PlusIcon className="w-5 h-5 -ml-0.5" />
      Agregar {textAdd}
    </button>
  )
}
