'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/src/components/ui/input'

export default function TestimoniosFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    const query = e.target.value

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="mb-4">
      <Input
        placeholder="Filtrar por nombre, apellido o email..."
        defaultValue={searchParams.get('q') || ''}
        onChange={handleFilterChange}
        className="max-w-sm"
      />
    </div>
  )
}
