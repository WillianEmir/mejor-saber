'use client'

import { useState, useTransition } from 'react' 
import { toast } from 'sonner'
import { TipoSeccion } from '@/src/generated/prisma'
import { PlusCircle, Edit, Trash2, BookOpen, Puzzle, Info } from 'lucide-react'

import { deleteSubTema, updateSubTemaImage } from '@/app/dashboard/admin/contenidos-curriculares/_lib/subTema.actions'
import { deleteActividadInteractiva, updateActividadImage } from '@/app/dashboard/admin/contenidos-curriculares/_lib/actividadInteractiva.action'
import { deleteSeccion } from '../../_lib/seccion.actions'
import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { SeccionType } from '../../_lib/seccion.schema'
import { SubTemaType } from '../../_lib/subTema.schema'
import { ActividadInteractivaType } from '../../_lib/actividadInteractiva.schema'

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/Button'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'
import SubTemaModal from '../subtemas/SubTemaModal'
import ActividadInteractivaModal from '../actividades/ActividadInteractivaModal'
import SeccionModal from './SeccionModal'
import UploadImage from '../UploadImage'

interface SeccionesListProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export default function SeccionesList({ ejeTematico }: SeccionesListProps) {

  const [isSubTemaModalOpen, setSubTemaModalOpen] = useState(false)
  const [isActividadModalOpen, setActividadModalOpen] = useState(false)
  const [isSeccionModalOpen, setSeccionModalOpen] = useState(false)
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const [selectedSubTema, setSelectedSubTema] = useState<SubTemaType | null>(null)
  const [selectedActividad, setSelectedActividad] = useState<ActividadInteractivaType | null>(null)
  const [selectedSeccion, setSelectedSeccion] = useState<SeccionType | null>(null)

  const [currentSeccionId, setCurrentSeccionId] = useState<string>('')
  const [deleteAction, setDeleteAction] = useState<{ action: () => void; title: string; description: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  if (!ejeTematico) return (
    <div>
      <p>No hay ejes temáticos para mostrar.</p>
    </div>
  )

  const secciones = ejeTematico.secciones

  const openDeleteDialog = (action: () => void, title: string, description: string) => {
    setDeleteAction({ action, title, description })
    setConfirmDeleteOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteAction(null)
    setConfirmDeleteOpen(false)
  }

  const confirmDelete = () => {
    if (deleteAction) {
      startTransition(async () => {
        deleteAction.action()
        closeDeleteDialog()
      })
    }
  }

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
    const action = async () => {
      const result = await deleteSeccion(id, ejeTematico.id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
    openDeleteDialog(action, 'Eliminar Sección', '¿Estás seguro de eliminar esta sección? Esto eliminará todos los subtemas y actividades asociados.')
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
    const action = async () => {
      const result = await deleteSubTema(id, ejeTematico.id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
    openDeleteDialog(action, 'Eliminar Subtema', '¿Estás seguro de eliminar este subtema?')
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
    const action = async () => {
      const result = await deleteActividadInteractiva(id, ejeTematico.id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    }
    openDeleteDialog(action, 'Eliminar Actividad', '¿Estás seguro de eliminar esta actividad?')
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
                <div className="space-y-4">
                  {seccion.tipo === TipoSeccion.TEORIA && (
                    seccion.subTemas.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {seccion.subTemas.map((subtema) => (
                          <Card key={subtema.id} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className='flex justify-between items-start'>
                                <CardTitle>{subtema.nombre}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditSubTema(subtema)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteSubTema(subtema.id)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </div>
                              <CardDescription>{subtema.descripcion}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              {subtema.video && <p className="text-sm"><strong>Video:</strong> <a href={subtema.video} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver video</a></p>}
                              {subtema.ejemplo && <p className="text-sm"><strong>Ejemplo:</strong> {subtema.ejemplo}</p>}
                              <div className="mt-4">
                                <p className="text-sm font-semibold mb-2">Imagen:</p>
                                <UploadImage imageUrl={subtema.imagen} itemId={subtema.id} serverAction={updateSubTemaImage} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay subtemas. Haz clic en &quot;Añadir Subtema&quot; para empezar.</p>
                    )
                  )}

                  {seccion.tipo === TipoSeccion.INTERACTIVA && (
                    seccion.actividades.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {seccion.actividades.map((actividad) => (
                          <Card key={actividad.id} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className='flex justify-between items-start'>
                                <CardTitle>{actividad.nombre}</CardTitle>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon" onClick={() => handleEditActividad(actividad)}><Edit className="h-4 w-4" /></Button>
                                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteActividad(actividad.id)} disabled={isPending}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                              </div>
                              <CardDescription>Tipo: {actividad.tipo}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm"><strong>Match:</strong> {actividad.match}</p>
                              <p className="text-sm"><strong>Retroalimentación:</strong> {actividad.retroalimentacion}</p>
                              <div className="mt-4">
                                <p className="text-sm font-semibold mb-2">Imagen:</p>
                                <UploadImage imageUrl={actividad.imagen} itemId={actividad.id} serverAction={updateActividadImage} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No hay actividades. Haz clic en &quot;Añadir Actividad&quot; para empezar.</p>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SeccionModal
        isOpen={isSeccionModalOpen}
        onClose={closeModals}
        ejeTematicoId={ejeTematico.id}
        seccion={selectedSeccion}
      />

      <SubTemaModal
        isOpen={isSubTemaModalOpen}
        onClose={closeModals}
        seccionId={currentSeccionId}
        ejeTematicoId={ejeTematico.id}
        subTema={selectedSubTema}
      />

      <ActividadInteractivaModal
        isOpen={isActividadModalOpen}
        onClose={closeModals}
        seccionId={currentSeccionId}
        ejeTematicoId={ejeTematico.id}
        actividad={selectedActividad}
      />

      <ConfirmationDialog
        isOpen={isConfirmDeleteOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title={deleteAction?.title || 'Confirmar'}
        description={deleteAction?.description || '¿Estás seguro?'}
        isPending={isPending}
      />
    </>
  )
}