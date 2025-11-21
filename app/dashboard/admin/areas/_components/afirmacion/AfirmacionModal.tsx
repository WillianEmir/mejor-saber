'use client'

import { useEffect, useTransition } from 'react' 
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'

import { createOrUpdateAfirmacion } from '@/app/dashboard/admin/areas/_lib/afirmacion.actions'
import { AfirmacionSchema, AfirmacionType } from '@/app/dashboard/admin/areas/_lib/afirmacion.schema'

interface AfirmacionModalProps {
  isOpen: boolean
  onClose: () => void
  competenciaId: string
  afirmacion: AfirmacionType | null
}

export default function AfirmacionModal({ isOpen, onClose, competenciaId, afirmacion }: AfirmacionModalProps) {
  const [isPending, startTransition] = useTransition()

  const editMode = !!afirmacion?.id

  const form = useForm<AfirmacionType>({ 
    defaultValues: {
      id: afirmacion?.id || undefined,
      nombre: afirmacion?.nombre || '',
      competenciaId: competenciaId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: afirmacion?.id || undefined,
        nombre: afirmacion?.nombre || '',
        competenciaId: competenciaId,
      })
    }
  }, [isOpen, afirmacion, form, competenciaId])

  const onSubmit = (data: AfirmacionType) => {
    const parsedData = AfirmacionSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message) 
      })
      return
    } 

    const formData = new FormData();
    formData.append('id', data.id || '');
    formData.append('nombre', data.nombre); 
    formData.append('competenciaId', data.competenciaId);

    startTransition(async () => {
      const result = await createOrUpdateAfirmacion(formData)
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
            {editMode ? 'Editar Afirmación' : 'Agregar Nueva Afirmación'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {editMode && <input type="hidden" {...form.register('id')} />}
            <input type="hidden" {...form.register('competenciaId')} />

            <FormField
              control={form.control} 
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Afirmación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Reconoce propiedades de las figuras geométricas" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Afirmación')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}