'use client'

import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { updateEjeTematicoImage } from "../../_lib/ejeTematico.actions"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/src/components/ui/card'
import { Separator } from '@/src/components/ui/separator'
import { Badge } from '@/src/components/ui/badge'
import UploadImage from '../UploadImage'
import { Globe, BookText, HelpCircle, Film, BarChart } from 'lucide-react'

interface EjeTematicoDetailsProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export default function EjeTematicoDetails({ ejeTematico }: EjeTematicoDetailsProps) {

  if (!ejeTematico) return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No se encontraron detalles</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 dark:text-gray-400 py-8">No hay detalles del eje temático para mostrar.</p>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-6 w-6" />
          {ejeTematico.nombre}
        </CardTitle>
        <CardDescription>Detalles del Eje Temático</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold flex items-center gap-2"><BookText className="h-4 w-4" /> Área y Contenido</h4>
              <Separator className="my-2" />
              <Badge variant="secondary">{ejeTematico.contenidoCurricular.area.nombre}</Badge>
              <p className="text-gray-900 dark:text-white mt-1">{ejeTematico.contenidoCurricular.nombre}</p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Pregunta Clave</h4>
              <Separator className="my-2" />
              <p className="italic text-gray-700 dark:text-gray-300">
                {ejeTematico.preguntaTematica ? `"${ejeTematico.preguntaTematica}"` : 'No definida.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold flex items-center gap-2"><BarChart className="h-4 w-4" /> Relevancia ICFES</h4>
              <Separator className="my-2" />
              <p className="text-gray-700 dark:text-gray-300">
                {ejeTematico.relevanciaICFES || 'No definida.'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Descripción Corta</h4>
              <Separator className="my-2" />
              <p className="text-gray-700 dark:text-gray-300">
                {ejeTematico.descripcionCorta || 'No hay descripción.'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Descripción Larga</h4>
              <Separator className="my-2" />
              <p className="text-gray-700 dark:text-gray-300">
                {ejeTematico.descripcionLarga || 'No hay descripción.'}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-semibold">Imagen de Portada</h4>
            <UploadImage
              imageUrl={ejeTematico.imagen}
              itemId={ejeTematico.id}
              serverAction={updateEjeTematicoImage}
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2"><Film className="h-4 w-4" /> Video Explicativo</h4>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">No hay video disponible.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
