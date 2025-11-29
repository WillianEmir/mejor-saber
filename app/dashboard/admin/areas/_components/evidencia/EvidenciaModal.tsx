'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateEvidencia } from '@/app/dashboard/admin/areas/_lib/evidencia.actions'
import { EvidenciaSchema, EvidenciaType } from '@/app/dashboard/admin/areas/_lib/evidencia.schema'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'

interface EvidenciaModalProps {
  isOpen: boolean
  onClose: () => void
  afirmacionId: string
  evidencia: EvidenciaType | null
}

export default function EvidenciaModal({ isOpen, onClose, afirmacionId, evidencia }: EvidenciaModalProps) {

  const [isPending, startTransition] = useTransition()

  const editMode = !!evidencia?.id

  const form = useForm<EvidenciaType>({
    defaultValues: {
      id: evidencia?.id || undefined,
      nombre: evidencia?.nombre || '',
      afirmacionId: afirmacionId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: evidencia?.id || undefined,
        nombre: evidencia?.nombre || '',
        afirmacionId: afirmacionId,
      })
    }
  }, [isOpen, evidencia, form, afirmacionId])

  const onSubmit = (data: EvidenciaType) => {

    const parsedData = EvidenciaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    if (editMode) formData.append('id', data.id!);
    formData.append('nombre', data.nombre);
    formData.append('afirmacionId', data.afirmacionId);

    startTransition(async () => {
      const result = await createOrUpdateEvidencia(formData)
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
            {editMode ? 'Editar Evidencia' : 'Agregar Nueva Evidencia'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
            {editMode && <input type="hidden" {...form.register('id')} />}
            <input type="hidden" {...form.register('afirmacionId')} />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Evidencia</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Describe el comportamiento del área y el perímetro" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Evidencia')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}