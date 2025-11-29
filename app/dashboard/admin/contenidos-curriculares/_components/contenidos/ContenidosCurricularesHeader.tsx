'use client'

import { Plus } from 'lucide-react' 

import { Button } from '@/src/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/card'

interface ContenidosCurricularesHeaderProps { 
  onAddContenido: () => void
}

export default function ContenidosCurricularesHeader({ onAddContenido }: ContenidosCurricularesHeaderProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold">
            Contenidos Curriculares
          </CardTitle>
          <CardDescription>
            Gestiona los contenidos curriculares y sus ejes temáticos.
          </CardDescription>
        </div>
        <Button onClick={onAddContenido}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Contenido
        </Button>
      </CardHeader>
    </Card>
  )
}
