
'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { TipoActividadInteractiva } from '@/src/generated/prisma'

import { CldUploadButton } from '@/src/components/ui/CldUploadButton'
import { createOrUpdateActividadInteractiva } from '@/app/dashboard/admin/contenidos-curriculares/_lib/actividadInteractiva.action'
import { ActividadInteractivaSchema, ActividadInteractivaType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/actividadInteractiva.schema'

import { Button } from '@/src/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'

interface Props {
  isOpen: boolean
  onClose: () => void
  seccionId: string
  ejeTematicoId: string
  actividad: ActividadInteractivaType | null
}

export default function ActividadInteractivaModal({ isOpen, onClose, seccionId, ejeTematicoId, actividad }: Props) {
  const [isPending, startTransition] = useTransition()
  const editMode = !!actividad?.id

  const form = useForm<ActividadInteractivaType>({
    defaultValues: {
      id: actividad?.id || undefined,
      nombre: actividad?.nombre || '',
      tipo: actividad?.tipo || undefined,
      match: actividad?.match || '',
      retroalimentacion: actividad?.retroalimentacion || '',
      seccionId: seccionId,
      ejeTematicoId: ejeTematicoId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: actividad?.id || undefined,
        nombre: actividad?.nombre || '',
        tipo: actividad?.tipo || undefined,
        match: actividad?.match || '',
        retroalimentacion: actividad?.retroalimentacion || '',
        seccionId: seccionId,
        ejeTematicoId: ejeTematicoId,
      })
    }
  }, [isOpen, actividad, seccionId, ejeTematicoId, form])

  const onSubmit = (data: ActividadInteractivaType) => {
    const parsedData = ActividadInteractivaSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    if (data.id) formData.append('id', data.id)
    formData.append('nombre', data.nombre)
    formData.append('tipo', data.tipo)
    if (data.match) formData.append('match', data.match)
    if (data.retroalimentacion) formData.append('retroalimentacion', data.retroalimentacion)
    formData.append('seccionId', data.seccionId)
    formData.append('ejeTematicoId', data.ejeTematicoId)

    startTransition(async () => {
      const result = await createOrUpdateActividadInteractiva(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof ActividadInteractivaType, {
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
            {editMode ? 'Editar Actividad Interactiva' : 'Agregar Nueva Actividad Interactiva'}
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
                      <Input placeholder="Ej: Preguntas de opción múltiple" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Actividad</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TipoActividadInteractiva).map(tipo => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="match"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Match (Contenido)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contenido para la actividad de match..."
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
              name="retroalimentacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retroalimentación</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Retroalimentación para la actividad..."
                      rows={3}
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Actividad')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
