'use client'

import { useState, useTransition } from 'react'  
import { toast } from 'sonner'
import { PlusCircle, CheckCircle, Edit, Trash2 } from 'lucide-react'

import { deleteObjetivoAprendizaje } from '@/app/dashboard/admin/contenidos-curriculares/_lib/objetivoAprendizaje.action'
import { ObjetivoAprendizajeType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/objetivoAprendizaje.schema'

import { Button } from '@/src/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/src/components/ui/card'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'
import ObjetivoAprendizajeModal from '../objetivos/ObjetivoAprendizajeModal'

interface EjeTematicoObjetivosProps {
  ejeTematicoId: string | undefined
  objetivosAprendizaje: ObjetivoAprendizajeType[] | undefined
}

export default function EjeTematicoObjetivos({ ejeTematicoId, objetivosAprendizaje}: EjeTematicoObjetivosProps) {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedObjetivo, setSelectedObjetivo] = useState<ObjetivoAprendizajeType | null>(null)
  const [objetivoToDeleteId, setObjetivoToDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  
  const handleAdd = () => {
    setSelectedObjetivo(null)
    setIsModalOpen(true)
  }

  const handleEdit = (objetivo: ObjetivoAprendizajeType) => {
    setSelectedObjetivo(objetivo)
    setIsModalOpen(true)
  }

  const openDeleteDialog = (id: string) => {
    setObjetivoToDeleteId(id)
  }

  const closeDeleteDialog = () => {
    setObjetivoToDeleteId(null)
  }

  const handleDelete = () => {
    if (!objetivoToDeleteId) return

    startTransition(async () => {
      const result = await deleteObjetivoAprendizaje(objetivoToDeleteId, ejeTematicoId!)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result?.message || 'Error al eliminar el objetivo.')
      }
      closeDeleteDialog()
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedObjetivo(null)
  }

  const objetivos = objetivosAprendizaje ?? []

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Objetivos de Aprendizaje</CardTitle>
            <CardDescription>
              Define qué deben saber los estudiantes al completar este eje.
            </CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Agregar Objetivo
          </Button>
        </CardHeader>
        <CardContent>
          {objetivos.length > 0 ? (
            <ul className="space-y-3">
              {objetivos.map((objetivo) => (
                <li
                  key={objetivo.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {objetivo.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(objetivo)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => openDeleteDialog(objetivo.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              Aún no se han agregado objetivos de aprendizaje.
            </div>
          )}
        </CardContent>
      </Card>

      <ObjetivoAprendizajeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ejeTematicoId={ejeTematicoId}
        objetivo={selectedObjetivo}
      />

      <ConfirmationDialog
        isOpen={!!objetivoToDeleteId}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que quieres eliminar este objetivo de aprendizaje?"
        isPending={isPending}
      />
    </>
  )
}