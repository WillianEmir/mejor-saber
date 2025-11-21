'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline'

import { SubTemaSchema, SubTemaType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/subTema.schema'
import { createOrUpdateSubTema } from '@/app/dashboard/admin/contenidos-curriculares/_lib/subTema.actions'

import { Button } from '@/src/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'

interface Props {
  isOpen: boolean
  onClose: () => void
  seccionId: string
  ejeTematicoId: string
  subTema: SubTemaType | null
}

export default function SubTemaModal({ isOpen, onClose, seccionId, ejeTematicoId, subTema }: Props) {
  const [isPending, startTransition] = useTransition()
  const editMode = !!subTema?.id

  const form = useForm<SubTemaType>({
    defaultValues: {
      id: subTema?.id || undefined,
      nombre: subTema?.nombre || '',
      descripcion: subTema?.descripcion || '',
      video: subTema?.video || '',
      ejemplo: subTema?.ejemplo || '',
      seccionId: seccionId,
      ejeTematicoId: ejeTematicoId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: subTema?.id || undefined,
        nombre: subTema?.nombre || '',
        descripcion: subTema?.descripcion || '',
        video: subTema?.video || '',
        ejemplo: subTema?.ejemplo || '',
        seccionId: seccionId,
        ejeTematicoId: ejeTematicoId,
      })
    }
  }, [isOpen, subTema, seccionId, ejeTematicoId, form])

  const onSubmit = (data: SubTemaType) => {
    const parsedData = SubTemaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    if (data.id) formData.append('id', data.id)
    formData.append('nombre', data.nombre ?? '')
    if (data.descripcion) formData.append('descripcion', data.descripcion ?? '')
    if (data.video) formData.append('video', data.video ?? '')
    if (data.ejemplo) formData.append('ejemplo', data.ejemplo ?? '')
    formData.append('seccionId', data.seccionId)
    formData.append('ejeTematicoId', data.ejeTematicoId!)

    startTransition(async () => {
      const result = await createOrUpdateSubTema(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SubTemaType, {
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
            {editMode ? 'Editar Subtema' : 'Agregar Nuevo Subtema'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="hidden" {...form.register('seccionId')} />
            <input type="hidden" {...form.register('ejeTematicoId')} />
            {editMode && <input type="hidden" {...form.register('id')} />}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Conceptos básicos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Video</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: https://youtube.com/watch?v=..." {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el subtema..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ejemplo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejemplo</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Proporciona un ejemplo..."
                      rows={3}
                      {...field}
                      value={field.value ?? ''}
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Subtema')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
