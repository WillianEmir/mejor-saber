'use client'

import { useState, useTransition } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table'
import { Button } from '@/src/components/ui/Button'
import { PlusCircle, Edit, Trash2 } from 'lucide-react'
import { SedeModal } from './SedeModal'
import { deleteSede } from '../_lib/sede.actions'
import { toast } from 'sonner'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/src/components/ui/alert-dialog'
import { SchoolSede } from '@/src/generated/prisma'

interface SedeListProps {
  sedes: SchoolSede[]
}

export const SedeList = ({ sedes }: SedeListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSede, setEditingSede] = useState<SchoolSede | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [sedeToDelete, setSedeToDelete] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleOpenModal = (sede?: SchoolSede) => {
    setEditingSede(sede || null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSede(null)
  }

  const handleDeleteClick = (id: string) => {
    setSedeToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (sedeToDelete) {
      startTransition(async () => {
        const result = await deleteSede(sedeToDelete)
        if (result.success) {
          toast.success(result.message)
        } else {
          toast.error(result.message)
        }
        setIsDeleteDialogOpen(false)
        setSedeToDelete(null)
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Sede
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>DANE</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sedes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No hay sedes registradas.
                </TableCell>
              </TableRow>
            ) : (
              sedes.map((sede) => (
                <TableRow key={sede.id}>
                  <TableCell className="font-medium">{sede.nombre}</TableCell>
                  <TableCell>{sede.DANE}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(sede)}
                      disabled={isPending}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(sede.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SedeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingSede}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la sede
              y removerá sus datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isPending}>
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
