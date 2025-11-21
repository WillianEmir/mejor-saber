'use client'

import { useState, useTransition, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { MoreHorizontal, PlusCircle } from 'lucide-react'

import { deletePregunta } from '@/app/dashboard/admin/preguntas/_lib/pregunta.actions'
import { PreguntaWithRelationsType } from '@/app/dashboard/admin/preguntas/_lib/pregunta.schema'
import { ContenidoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.schema'
import { AreaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/area.schema'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Button } from '@/src/components/ui/Button'
import { Badge } from '@/src/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu'
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'

import Pagination from './PreguntasPagination'
import PreguntasFilters from './PreguntasFilters' 
import PreguntaModal from './PreguntaModal'

interface AdminPreguntasProps {
  preguntas: PreguntaWithRelationsType[]
  areas: AreaWithRelationsType[]
  contenidosCurriculares: ContenidoWithRelationsType[]
  totalPages: number
  currentPage: number
}

export default function PreguntasList({ preguntas, areas, contenidosCurriculares, totalPages, currentPage }: AdminPreguntasProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [preguntaToDelete, setPreguntaToDelete] = useState<string | null>(null)

  // State to hold the pregunta object when opening the modal for edit/view
  const [preguntaForModal, setPreguntaForModal] = useState<PreguntaWithRelationsType | null>(null)

  const isModalOpen = searchParams.has('add-question') || searchParams.has('edit-question') || searchParams.has('view-question')
  const isViewMode = searchParams.has('view-question')

  const onCloseModal = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete('add-question')
    newSearchParams.delete('edit-question')
    newSearchParams.delete('view-question')
    router.push(`${pathname}?${newSearchParams.toString()}`)
    setPreguntaForModal(null)
  }, [pathname, router, searchParams])

  const handlePreguntaAdd = (): void => {
    setPreguntaForModal(null) // Ensure no old data is passed for adding
    const params = new URLSearchParams(searchParams)
    params.set('add-question', 'true')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleEdit = (pregunta: PreguntaWithRelationsType) => {
    setPreguntaForModal(pregunta) // Set the selected pregunta for editing
    const params = new URLSearchParams(searchParams)
    params.set('edit-question', 'true')
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleView = (pregunta: PreguntaWithRelationsType) => {
    setPreguntaForModal(pregunta) // Set the selected pregunta for viewing
    const params = new URLSearchParams(searchParams)
    params.set('view-question', 'true')
    router.push(`${pathname}?${params.toString()}`)
  }

  const openDeleteDialog = (id: string) => {
    setPreguntaToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setPreguntaToDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!preguntaToDelete) return

    startTransition(async () => {
      const result = await deletePregunta(preguntaToDelete)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      closeDeleteDialog()
    })
  }

  const getAreaName = (evidenciaId: string) => {
    for (const area of areas) {
      for (const competencia of area!.competencias) {
        for (const afirmacion of competencia.afirmaciones) {
          if (afirmacion.evidencias.some((ev) => ev.id === evidenciaId)) {
            return area!.nombre
          }
        }
      }
    }
    return 'N/A'
  }

  return (
    <div className="p-4 sm:p-6 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Administración de Preguntas</CardTitle>
          <Button onClick={handlePreguntaAdd}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Pregunta
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <PreguntasFilters areas={areas} />
          </div>
          {preguntas.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contexto y Enunciado</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Área
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Acciones</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preguntas.map((pregunta) => (
                      <TableRow key={pregunta.id}>
                        <TableCell>
                          <div className="font-medium truncate max-w-[200px] md:max-w-[400px] lg:max-w-[600px]">
                            {pregunta.contexto}
                          </div>
                          <div className="text-muted-foreground truncate max-w-[200px] md:max-w-[400px] lg:max-w-[600px]">
                            {pregunta.enunciado}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">
                            {getAreaName(pregunta.evidenciaId)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleView(pregunta)}
                              >
                                Ver
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(pregunta)}
                              >
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(pregunta.id!)}
                                disabled={isPending}
                                className="text-red-600"
                              >
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
              />
            </>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium">No hay Preguntas</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Aún no se han agregado Preguntas para mostrar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer."
        isPending={isPending}
      />

      <PreguntaModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        areas={areas}
        pregunta={preguntaForModal}
        isViewMode={isViewMode}
        contenidosCurriculares={contenidosCurriculares}
      />
    </div>
  )
}