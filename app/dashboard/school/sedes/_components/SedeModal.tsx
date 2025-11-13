'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/src/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { SedeSchema } from '../_lib/sede.schema'
import { createOrUpdateSede } from '../_lib/sede.actions'
import { toast } from 'sonner'
import { FormState } from '@/src/types'

interface SedeModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: z.infer<typeof SedeSchema> & { id: string } | null
}

export const SedeModal = ({ isOpen, onClose, initialData }: SedeModalProps) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof SedeSchema>>({
    defaultValues: initialData || {
      nombre: '',
      DANE: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset(initialData || { nombre: '', DANE: '' })
    }
  }, [isOpen, initialData, form])

  const onSubmit = (data: z.infer<typeof SedeSchema>) => {

    const parsedData = SedeSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    if (data.id) formData.append('id', data.id)
    formData.append('nombre', data.nombre)
    formData.append('DANE', data.DANE)

    startTransition(async () => {
      const result = await createOrUpdateSede(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
      } else {
        toast.error(result.message)
        if (result.errors) {
          for (const [key, value] of Object.entries(result.errors)) {
            form.setError(key as keyof z.infer<typeof SedeSchema>, {
              type: 'manual',
              message: value?.[0],
            })
          }
        }
      }
    })
  }

  const title = initialData ? 'Editar Sede' : 'Crear Sede'
  const description = initialData ? 'Edita la sede existente.' : 'Agrega una nueva sede.'
  const actionLabel = initialData ? 'Guardar cambios' : 'Crear'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Nombre de la sede" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="DANE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DANE</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Código DANE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {actionLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
