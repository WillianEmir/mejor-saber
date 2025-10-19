import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'

interface EjeTematicoDetailsProps { 
  ejeTematico: EjeTematicoWithRelationsType
}

export default function EjeTematicoDetails({ ejeTematico }: EjeTematicoDetailsProps) {
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Eje Temático</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Área
            </span>
            <span className="text-gray-900 dark:text-white">
              {ejeTematico.contenidoCurricular.area.nombre}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Contenido Curricular
            </span>
            <span className="text-gray-900 dark:text-white">
              {ejeTematico.contenidoCurricular.nombre}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-semibold">Descripción Larga</h4>
          <p className="text-gray-700 dark:text-gray-300">
            {ejeTematico.descripcionLarga || 'No hay descripción.'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Descripción Corta</h4>
          <p className="text-gray-700 dark:text-gray-300">
            {ejeTematico.descripcionCorta || 'No hay descripción.'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Pregunta Temática Clave</h4>
          <p className="italic text-gray-700 dark:text-gray-300">
            {ejeTematico.preguntaTematica
              ? `"${ejeTematico.preguntaTematica}"`
              : 'No definida.'}
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Relevancia para Pruebas ICFES</h4>
          <p className="text-gray-700 dark:text-gray-300">
            {ejeTematico.relevanciaICFES || 'No definida.'}
          </p>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-semibold">Imagen de Portada</h4>
          {ejeTematico.imagen ? (
            <div className="mt-2">
              <img 
                src={ejeTematico.imagen} 
                alt={`Imagen para ${ejeTematico.nombre}`}
                className="rounded-lg max-w-sm"
              />
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No hay imagen disponible.</p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Video Explicativo</h4>
          {ejeTematico.video ? (
            <div className="mt-2">
              <a 
                href={ejeTematico.video} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
              >
                Ver video
              </a>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No hay video disponible.</p>
          )}
        </div>

      </CardContent>
    </Card>
  )
}
