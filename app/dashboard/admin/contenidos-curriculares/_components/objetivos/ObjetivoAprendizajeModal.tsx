'use client'

import { useEffect, useTransition } from 'react' 
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateObjetivoAprendizaje } from '@/app/dashboard/admin/contenidos-curriculares/_lib/objetivoAprendizaje.action'
import { ObjetivoAprendizajeSchema, ObjetivoAprendizajeType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/objetivoAprendizaje.schema'

import { Button } from '@/src/components/ui/Button'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'

interface ObjetivoAprendizajeModalProps { 
  isOpen: boolean
  onClose: () => void
  ejeTematicoId: string | undefined
  objetivo: ObjetivoAprendizajeType | null
}

export default function ObjetivoAprendizajeModal({ isOpen, onClose, ejeTematicoId, objetivo }: ObjetivoAprendizajeModalProps) {

  const [isPending, startTransition] = useTransition()
  
  const editMode = !!objetivo?.id

  const form = useForm<ObjetivoAprendizajeType>({
    defaultValues: {
      id: objetivo?.id || undefined,
      descripcion: objetivo?.descripcion || '',
      ejeTematicoId: ejeTematicoId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: objetivo?.id || undefined,
        descripcion: objetivo?.descripcion || '',
        ejeTematicoId: ejeTematicoId,
      })
    }
  }, [isOpen, objetivo, ejeTematicoId, form])

  const onSubmit = (data: ObjetivoAprendizajeType) => {

    const parsedData = ObjetivoAprendizajeSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()

    if (data.id) formData.append('id', data.id)
    formData.append('descripcion', data.descripcion)
    formData.append('ejeTematicoId', data.ejeTematicoId)

    startTransition(async () => {
      const result = await createOrUpdateObjetivoAprendizaje(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof ObjetivoAprendizajeType, {
              type: 'manual',
              message: (value as string[]).join(', '),
            })
          })
        }
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Objetivo de Aprendizaje' : 'Agregar Nuevo Objetivo'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="hidden" {...form.register('ejeTematicoId')} />
            {editMode && <input type="hidden" {...form.register('id')} />}

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Objetivo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el objetivo de aprendizaje..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Objetivo')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
