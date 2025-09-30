'use client'

import { useState, useTransition } from 'react'
import { toast } from 'react-toastify'
import { PlusCircle, CheckCircle, Edit, Trash2 } from 'lucide-react'

import { Button } from '@/src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/src/components/ui/card'
import { ObjetivoAprendizajeType } from '@/src/lib/schemas/objetivoAprendizaje.schema'
import { deleteObjetivoAprendizaje } from '@/src/lib/actions/objetivoAprendizaje.action'
import ObjetivoAprendizajeModal from './ObjetivoAprendizajeModal'
import { EjeTematicoWithRelationsType } from '@/src/lib/schemas/ejeTematico.schema'

interface EjeTematicoObjetivosProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export default function EjeTematicoObjetivos({ejeTematico}: EjeTematicoObjetivosProps) {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedObjetivo, setSelectedObjetivo] = useState<ObjetivoAprendizajeType | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleAdd = () => {
    setSelectedObjetivo(null)
    setIsModalOpen(true)
  }

  const handleEdit = (objetivo: ObjetivoAprendizajeType) => {
    setSelectedObjetivo(objetivo)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
      startTransition(async () => {
        const result = await deleteObjetivoAprendizaje(id, ejeTematico.id)
        if (result?.message.includes('exitosamente')) {
          toast.success(result.message)
        } else {
          toast.error(result?.message || 'Error al eliminar el objetivo.')
        }
      })
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedObjetivo(null)
  }

  const objetivos = ejeTematico.objetivosAprendizaje

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
          <ul className="space-y-3">
            {objetivos.map((objetivo) => (
              <li
                key={objetivo.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
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
                    onClick={() => handleDelete(objetivo.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <ObjetivoAprendizajeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ejeTematicoId={ejeTematico.id}
        objetivo={selectedObjetivo}
      />
    </>
  )
}
