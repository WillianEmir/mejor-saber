'use client'

import { useEffect, useTransition } from 'react'  
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { createOrUpdateEjeTematico } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.actions'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'

import { EjeTematicoSchema, EjeTematicoType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'

interface EjeTematicoModalProps {
  isOpen: boolean
  onClose: () => void
  ejeTematico: EjeTematicoType | null
  contenidoCurricularId: string
}

export default function EjeTematicoModal({ isOpen, onClose, ejeTematico, contenidoCurricularId }: EjeTematicoModalProps) {

  const [isPending, startTransition] = useTransition()

  const editMode = !!ejeTematico?.id

  const form = useForm<EjeTematicoType>({
    defaultValues: {
      id: ejeTematico?.id || undefined,
      nombre: ejeTematico?.nombre || '',
      orden: ejeTematico?.orden || 0,
      descripcionCorta: ejeTematico?.descripcionCorta || '',
      descripcionLarga: ejeTematico?.descripcionLarga || '',
      preguntaTematica: ejeTematico?.preguntaTematica || '',
      relevanciaICFES: ejeTematico?.relevanciaICFES || '',
      video: ejeTematico?.video || '',
      imagen: ejeTematico?.imagen || '',
      contenidoCurricularId: contenidoCurricularId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: ejeTematico?.id || undefined,
        nombre: ejeTematico?.nombre || '',
        orden: ejeTematico?.orden || 0,
        descripcionCorta: ejeTematico?.descripcionCorta || '',
        descripcionLarga: ejeTematico?.descripcionLarga || '',
        preguntaTematica: ejeTematico?.preguntaTematica || '',
        relevanciaICFES: ejeTematico?.relevanciaICFES || '',
        video: ejeTematico?.video || '',
        imagen: ejeTematico?.imagen || '',
        contenidoCurricularId: contenidoCurricularId,
      })
    }
  }, [isOpen, ejeTematico, contenidoCurricularId, form])

  const onSubmit = (data: EjeTematicoType) => {

    const parsedData = EjeTematicoSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    startTransition(async () => {
      const result = await createOrUpdateEjeTematico(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, value]) => {
            form.setError(key as keyof EjeTematicoType, {
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
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? <PencilIcon className="h-6 w-6" /> : <PlusCircleIcon className="h-6 w-6" />}
            {editMode ? 'Editar Eje Temático' : 'Agregar Nuevo Eje Temático'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <input type="hidden" {...form.register('contenidoCurricularId')} />
            {editMode && <input type="hidden" {...form.register('id')} />}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Álgebra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orden"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcionCorta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Corta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Breve descripción del eje temático" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcionLarga"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción Larga</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción detallada del eje temático" rows={4} {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preguntaTematica"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pregunta Temática</FormLabel>
                  <FormControl>
                    <Textarea placeholder="¿Qué pregunta clave aborda este eje?" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relevanciaICFES"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevancia ICFES</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ej: Alta" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} value={field.value ?? ''} />
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
                {isPending ? (editMode ? 'Guardando...' : 'Creando...') : (editMode ? 'Guardar Cambios' : 'Crear Eje Temático')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}