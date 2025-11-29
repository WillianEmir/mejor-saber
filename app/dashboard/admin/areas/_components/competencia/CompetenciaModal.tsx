'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateCompetencia } from '@/app/dashboard/admin/areas/_lib/competencia.actions'
import { CompetenciaSchema, CompetenciaType } from '@/app/dashboard/admin/areas/_lib/competencia.schema'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'

interface CompetenciaModalProps {
  isOpen: boolean
  onClose: () => void
  areaId: string
  competencia: CompetenciaType | null
}

export default function CompetenciaModal({ isOpen, onClose, areaId, competencia }: CompetenciaModalProps) {

  const [isPending, startTransition] = useTransition()

  const editMode = !!competencia?.id

  const form = useForm<CompetenciaType>({
    defaultValues: {
      id: competencia?.id || undefined,
      nombre: competencia?.nombre || '',
      areaId: areaId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: competencia?.id || undefined,
        nombre: competencia?.nombre || '',
        areaId: areaId,
      })
    }
  }, [isOpen, competencia, form, areaId])

  const onSubmit = (data: CompetenciaType) => {

    const parsedData = CompetenciaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    if (editMode) formData.append('id', data.id!);
    formData.append('nombre', data.nombre);
    formData.append('areaId', data.areaId);

    startTransition(async () => {
      const result = await createOrUpdateCompetencia(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Competencia' : 'Agregar Nueva Competencia'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {editMode && <input type="hidden" {...form.register('id')} />}
            <input type="hidden" {...form.register('areaId')} />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Competencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pensamiento y sistemas geométricos" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Competencia')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}