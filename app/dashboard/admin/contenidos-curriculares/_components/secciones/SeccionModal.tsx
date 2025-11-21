
'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PencilIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import { TipoSeccion } from '@/src/generated/prisma'

import { SeccionSchema, SeccionType } from '../../_lib/seccion.schema'
import { createOrUpdateSeccion } from '../../_lib/seccion.actions'

import { Button } from '@/src/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Textarea } from '@/src/components/ui/textarea'

interface Props {
  isOpen: boolean
  onClose: () => void
  ejeTematicoId: string
  seccion: SeccionType | null
}

export default function SeccionModal({ isOpen, onClose, ejeTematicoId, seccion }: Props) {
  const [isPending, startTransition] = useTransition()
  const editMode = !!seccion?.id

  const form = useForm<SeccionType>({
    defaultValues: {
      id: seccion?.id || undefined,
      nombre: seccion?.nombre || '',
      descripcion: seccion?.descripcion || '',
      tipo: seccion?.tipo || undefined,
      ejeTematicoId: ejeTematicoId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: seccion?.id || undefined,
        nombre: seccion?.nombre || '',
        descripcion: seccion?.descripcion || '',
        tipo: seccion?.tipo || undefined,
        ejeTematicoId: ejeTematicoId,
      })
    }
  }, [isOpen, seccion, ejeTematicoId, form])

  const onSubmit = (data: SeccionType) => {
    const parsedData = SeccionSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    if (data.id) formData.append('id', data.id)
    formData.append('nombre', data.nombre)
    if (data.descripcion) formData.append('descripcion', data.descripcion)
    formData.append('tipo', data.tipo)
    formData.append('ejeTematicoId', data.ejeTematicoId)

    startTransition(async () => {
      const result = await createOrUpdateSeccion(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof SeccionType, {
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
            {editMode ? 'Editar Sección' : 'Agregar Nueva Sección'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
                      <Input placeholder="Ej: Introducción a..." {...field} />
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
                    <FormLabel>Tipo de Sección</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TipoSeccion).map(tipo => (
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
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la sección..."
                      rows={4}
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Sección')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

