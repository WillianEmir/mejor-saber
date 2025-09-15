'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { TrashIcon } from '@heroicons/react/24/outline'
import { deleteArea } from '@/src/lib/actions/area.actions'

// Types
import type { Areatype, AreaWithRelationsType } from '@/src/lib/schemas/area.schema'

interface ButtonDeleteAreaProps {
  area: AreaWithRelationsType
}

export default function ButtonDeleteArea({ area }: ButtonDeleteAreaProps) {

  const router = useRouter()
  const initialState = { message: '' }
  const deleteAreaWithId = deleteArea.bind(null, area?.id!)
  const [state, dispatch] = useActionState(deleteAreaWithId, initialState)

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('exitosamente')) {
        toast.success(state.message) // TODO: Estado Global para mostrar errores en otros componentes
        router.push('/dashboard/areas') 
      } else {
        toast.error(state.message)
      }
    }
  }, [state, router])
  
  return (
    <form action={dispatch}>
      <button
        type="submit"
        className="inline-flex items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        <TrashIcon className="h-4 w-4" />
        Eliminar
      </button>
    </form>
  )
}
