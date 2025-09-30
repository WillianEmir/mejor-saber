'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import { TipoSeccion } from '@/src/generated/prisma'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/Button'
import { PlusCircle, Edit, Trash2, BookOpen, Puzzle, Info } from 'lucide-react'

import { EjeTematicoWithRelationsType, SeccionType } from '@/src/lib/schemas/ejeTematico.schema'
import { deleteSubTema } from '@/src/lib/actions/subTema.action'
import { deleteActividadInteractiva } from '@/src/lib/actions/actividadInteractiva.action'
import { deleteSeccion } from '@/src/lib/actions/ejeTematico.action'

import SubTemaModal from './SubTemaModal'
import ActividadInteractivaModal from './ActividadInteractivaModal'
import SeccionModal from './SeccionModal'
import { SubTemaType } from '@/src/lib/schemas/subTema.schema'
import { ActividadInteractivaType } from '@/src/lib/schemas/actividadInteractiva.schema'

interface SeccionesListProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export default function SeccionesList({ ejeTematico }: SeccionesListProps) {
  const [isSubTemaModalOpen, setSubTemaModalOpen] = useState(false)
  const [isActividadModalOpen, setActividadModalOpen] = useState(false)
  const [isSeccionModalOpen, setSeccionModalOpen] = useState(false)

  const [selectedSubTema, setSelectedSubTema] = useState<SubTemaType | null>(null)
  const [selectedActividad, setSelectedActividad] = useState<ActividadInteractivaType | null>(null)
  const [selectedSeccion, setSelectedSeccion] = useState<SeccionType | null>(null)

  const [currentSeccionId, setCurrentSeccionId] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  const secciones = ejeTematico.secciones

  // Handlers for Seccion
  const handleAddSeccion = () => {
    setSelectedSeccion(null)
    setSeccionModalOpen(true)
  }

  const handleEditSeccion = (seccion: SeccionType) => {
    setSelectedSeccion(seccion)
    setSeccionModalOpen(true)
  }

  const handleDeleteSeccion = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta sección? Esto eliminará todos los subtemas y actividades asociados.')) {
      startTransition(async () => {
        const result = await deleteSeccion(id, ejeTematico.id)
        toast(result?.message)
      })
    }
  }

  // Handlers for SubTema
  const handleAddSubTema = (seccionId: string) => {
    setCurrentSeccionId(seccionId)
    setSelectedSubTema(null)
    setSubTemaModalOpen(true)
  }

  const handleEditSubTema = (subTema: SubTemaType) => {
    setCurrentSeccionId(subTema.seccionId)
    setSelectedSubTema(subTema)
    setSubTemaModalOpen(true)
  }

  const handleDeleteSubTema = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este subtema?')) {
      startTransition(async () => {
        const result = await deleteSubTema(id, ejeTematico.id)
        toast(result?.message)
      })
    }
  }

  // Handlers for ActividadInteractiva
  const handleAddActividad = (seccionId: string) => {
    setCurrentSeccionId(seccionId)
    setSelectedActividad(null)
    setActividadModalOpen(true)
  }

  const handleEditActividad = (actividad: ActividadInteractivaType) => {
    setCurrentSeccionId(actividad.seccionId)
    setSelectedActividad(actividad)
    setActividadModalOpen(true)
  }

  const handleDeleteActividad = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      startTransition(async () => {
        const result = await deleteActividadInteractiva(id, ejeTematico.id)
        toast(result?.message)
      })
    }
  }

  const closeModals = () => {
    setSubTemaModalOpen(false)
    setActividadModalOpen(false)
    setSeccionModalOpen(false)
    setSelectedSubTema(null)
    setSelectedActividad(null)
    setSelectedSeccion(null)
    setCurrentSeccionId('')
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Secciones de Contenido</h3>
          <Button onClick={handleAddSeccion}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Sección
          </Button>
        </div>

        {secciones.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Info className="mx-auto h-8 w-8 mb-2" />
            <p>No hay secciones de contenido todavía.</p>
            <p>¡Comienza agregando una nueva sección!</p>
          </div>
        ) : (
          secciones.map((seccion) => (
            <Card key={seccion.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {seccion.tipo === TipoSeccion.TEORIA ? <BookOpen /> : <Puzzle />}
                    {seccion.nombre}
                  </CardTitle>
                  <CardDescription>{seccion.descripcion}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => seccion.tipo === TipoSeccion.TEORIA ? handleAddSubTema(seccion.id) : handleAddActividad(seccion.id)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {seccion.tipo === TipoSeccion.TEORIA ? 'Añadir Subtema' : 'Añadir Actividad'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditSeccion(seccion)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSeccion(seccion.id)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                {seccion.tipo === TipoSeccion.TEORIA && (
                  seccion.subTemas.length > 0 ? (
                    <ul className="space-y-3">
                      {seccion.subTemas.map((subtema) => (
                        <li key={subtema.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <p>{subtema.nombre}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSubTema(subtema)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSubTema(subtema.id)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay subtemas. Haz clic en &quot;Añadir Subtema&quot; para empezar.</p>
                  )
                )}
                {seccion.tipo === TipoSeccion.INTERACTIVA && (
                  seccion.actividades.length > 0 ? (
                    <ul className="space-y-3">
                      {seccion.actividades.map((actividad) => (
                        <li key={actividad.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div>
                            <p>{actividad.nombre}</p>
                            <span>{actividad.tipo}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditActividad(actividad)}><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteActividad(actividad.id)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay actividades. Haz clic en &quot;Añadir Actividad&quot; para empezar.</p>
                  )
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {isSeccionModalOpen && (
        <SeccionModal
          isOpen={isSeccionModalOpen}
          onClose={closeModals}
          ejeTematicoId={ejeTematico.id}
          seccion={selectedSeccion}
        />
      )}

      {isSubTemaModalOpen && (
        <SubTemaModal
          isOpen={isSubTemaModalOpen}
          onClose={closeModals}
          seccionId={currentSeccionId}
          ejeTematicoId={ejeTematico.id}
          subTema={selectedSubTema}
        />
      )}

      {isActividadModalOpen && (
        <ActividadInteractivaModal
          isOpen={isActividadModalOpen}
          onClose={closeModals}
          seccionId={currentSeccionId}
          ejeTematicoId={ejeTematico.id}
          actividad={selectedActividad}
        />
      )}
    </>
  )
}
