import { Button } from '@/src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription, 
} from '@/src/components/ui/card'
import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { Edit, Trash2 } from 'lucide-react'

interface EjeTematicoHeaderProps {
  ejeTematico: EjeTematicoWithRelationsType
  onEdit: () => void
  onDeleteEjeTematico: () => void
}

export default function EjeTematicoHeader({ ejeTematico, onEdit, onDeleteEjeTematico }: EjeTematicoHeaderProps) {

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-bold">
            {ejeTematico.nombre}
          </CardTitle>
          <CardDescription>
            Administra los detalles y recursos de este eje temático.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={onDeleteEjeTematico}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardHeader>
    </Card>
  )
}
