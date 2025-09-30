'use client'

import { useState, useEffect, useTransition } from 'react'
import { notFound, usePathname } from 'next/navigation'
import Link from 'next/link'
import { MoveLeft } from 'lucide-react'
import ReactPlayer from 'react-player'


import { toggleSeccionProgreso, toggleSubTemaProgreso, toggleActividadProgreso } from '@/src/lib/actions/progress.actions'

import { EjeTematicoWithRelationsType } from '@/src/lib/schemas/ejeTematico.schema'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion'
import { Checkbox } from '@/src/components/ui/checkbox'
import { Card, CardContent } from '@/src/components/ui/card'
import { Button } from '../../ui/Button'

interface EjeTematicoViewProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export function EjeTematicoView({ ejeTematico }: EjeTematicoViewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!ejeTematico) notFound()

  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()

  const handleSeccionToggle = (seccionId: string, isCompleted: boolean) => {
    startTransition(() => {
      toggleSeccionProgreso(seccionId, pathname, isCompleted)
    })
  }

  const handleSubTemaToggle = (subTemaId: string, isCompleted: boolean) => {
    startTransition(() => {
      toggleSubTemaProgreso(subTemaId, pathname, isCompleted)
    })
  }

  const handleActividadToggle = (actividadId: string, isCompleted: boolean) => {
    startTransition(() => {
      toggleActividadProgreso(actividadId, pathname, isCompleted)
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <Link href="/dashboard/user/material-estudio">
          <Button variant="outline">
            <MoveLeft className="mr-2 h-4 w-4" />
            Volver al Material de Estudio
          </Button>
        </Link>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
        {ejeTematico.nombre}
      </h1>

      <Accordion type="single" collapsible defaultValue="introduccion" className="mb-8 w-full">
        <AccordionItem value="introduccion">
          <AccordionTrigger className="text-xl font-semibold">
            Introducción
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descripción</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {ejeTematico.descripcionCorta}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200">
                    Pregunta Temática
                  </h3>
                  <p className="mt-1 text-blue-700 dark:text-blue-300">
                    {ejeTematico.preguntaTematica}
                  </p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                    Relevancia para el ICFES
                  </h3>
                  <p className="mt-1 text-amber-700 dark:text-amber-300">
                    {ejeTematico.relevanciaICFES}
                  </p>
                </div>

                {(ejeTematico.imagen || ejeTematico.video) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ejeTematico.imagen && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Imagen de Referencia</h3>
                        <img
                          src={ejeTematico.imagen}
                          alt={`Imagen para ${ejeTematico.nombre}`}
                          className="rounded-lg object-cover w-full"
                        />
                      </div>
                    )}
                    {ejeTematico.video && (
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Video Explicativo</h3>
                        <div className="player-wrapper rounded-lg">
                          {isClient && (
                            <ReactPlayer
                              className="react-player"
                              src={ejeTematico.video}
                              width="100%"
                              height="100%"
                              controls={true}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Accordion
        type="multiple"
        defaultValue={['objetivos', `seccion-${ejeTematico.secciones[0]?.id}`]}
        className="w-full"
      >
        <AccordionItem value="objetivos">
          <AccordionTrigger className="text-xl font-semibold">
            Objetivos de Aprendizaje
          </AccordionTrigger>
          <AccordionContent>
            <ul className="list-inside list-disc space-y-2 pl-4">
              {ejeTematico.objetivosAprendizaje.map(objetivo => (
                <li key={objetivo.id}>{objetivo.descripcion}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {ejeTematico.secciones.map(seccion => {
          const isCompleted = seccion.progresos.length > 0 && seccion.progresos[0].completada
          return (
            <AccordionItem key={seccion.id} value={`seccion-${seccion.id}`}>
              <AccordionTrigger className="text-xl font-semibold">
                {seccion.nombre}
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <div className="flex items-center justify-between rounded-md border p-3 mb-4">
                  <span className="font-medium">Marcar esta sección como completada</span>
                  <Checkbox
                    checked={isCompleted}
                    onCheckedChange={() => handleSeccionToggle(seccion.id, isCompleted)}
                    disabled={isPending}
                  />
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  {seccion.descripcion}
                </p>

                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">Conceptos Clave</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Aquí tienes los pilares para entender todo el eje temático.
                  </p>
                  <Accordion type="multiple" className="w-full space-y-3">
                    {seccion.subTemas.map(subtema => {
                      const isCompleted = subtema.progresos.length > 0 && subtema.progresos[0].completado;
                      return (
                        <AccordionItem key={subtema.id} value={`subtema-${subtema.id}`} className="rounded-lg border bg-white dark:bg-gray-800">
                          <div className="flex items-center p-4">
                            <div onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => handleSubTemaToggle(subtema.id, isCompleted)}
                                disabled={isPending}
                                className="h-5 w-5"
                              />
                            </div>
                            <AccordionTrigger className="flex-1 pl-4 text-left font-semibold hover:no-underline">
                              {subtema.nombre}
                            </AccordionTrigger>
                          </div>
                          <AccordionContent className="p-4 pt-0">
                            <div className="space-y-4">
                              <div>
                                <h5 className="font-semibold mb-1">Descripción</h5>
                                <p className="text-gray-600 dark:text-gray-300">{subtema.descripcion}</p>
                              </div>
                              {subtema.ejemplo && (
                                <div>
                                  <h5 className="font-semibold mb-1">Ejemplo</h5>
                                  <p className="text-gray-600 dark:text-gray-300 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">{subtema.ejemplo}</p>
                                </div>
                              )}
                              {(subtema.imagen || subtema.video) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {subtema.imagen && (
                                    <div className="space-y-2">
                                      <h5 className="font-semibold">Imagen</h5>
                                      <img src={subtema.imagen} alt={`Imagen para ${subtema.nombre}`} className="rounded-lg object-cover w-full" />
                                    </div>
                                  )}
                                  {subtema.video && (
                                    <div className="space-y-2">
                                      <h5 className="font-semibold">Video</h5>
                                      <div className="player-wrapper rounded-lg overflow-hidden">
                                        {isClient && (
                                          <ReactPlayer
                                            className="react-player"
                                            src={subtema.video}
                                            width="100%"
                                            height="100%"
                                            controls={true}
                                          />
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold">Actividades Interactivas</h4>
                  {seccion.actividades.map(actividad => {
                    const isCompleted = actividad.progresos.length > 0 && actividad.progresos[0].completado
                    return (
                      <div
                        key={actividad.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <span className="font-medium">{actividad.nombre}</span>
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => handleActividadToggle(actividad.id, isCompleted)}
                          disabled={isPending}
                        />
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
