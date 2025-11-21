'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'

import { createOrUpdateArea } from '@/app/dashboard/admin/areas/_lib/area.actions'
import { AreaSchema, Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema'

interface AreaModalProps { 
  isOpen: boolean
  onClose: () => void
  area: Areatype | null
}

export default function AreaModal({ isOpen, onClose, area }: AreaModalProps) {
  const [isPending, startTransition] = useTransition()

  const editMode = !!area?.id

  const form = useForm<Areatype>({
    defaultValues: {
      id: area?.id || undefined,
      nombre: area?.nombre || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: area?.id || undefined,
        nombre: area?.nombre || '',
      })
    }
  }, [isOpen, area, form])

  const onSubmit = (data: Areatype) => {
    const parsedData = AreaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    formData.append('id', data.id || '');
    formData.append('nombre', data.nombre);

    startTransition(async () => {
      const result = await createOrUpdateArea(formData)
      if (result.message) {
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
            {editMode ? 'Editar Área' : 'Agregar Nueva Área'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Área</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Ciencias Sociales" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Área')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
