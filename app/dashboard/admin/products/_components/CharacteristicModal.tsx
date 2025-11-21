'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PlusCircleIcon, PencilIcon } from '@heroicons/react/24/outline'

import { characteristicSchema, CharacteristicType } from '@/app/dashboard/admin/products/_lib/characteristic.schema'
import { createOrUpdateProductoCharacteristic  } from '@/app/dashboard/admin/products/_lib/characteristic.actions'

import { Button } from '@/src/components/ui/Button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/src/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'

interface CharacteristicModalProps {
  characteristic?: CharacteristicType | null
  productId: string
  isOpen: boolean
  onClose: () => void
}

export default function CharacteristicModal({ characteristic, productId, isOpen, onClose }: CharacteristicModalProps) {
  const [isPending, startTransition] = useTransition()
  const editMode = !!characteristic?.id

  const form = useForm<CharacteristicType>({
    defaultValues: {
      id: characteristic?.id || undefined,
      name: characteristic?.name || '',
      productId: productId,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: characteristic?.id || undefined,
        name: characteristic?.name || '',
        productId: characteristic?.productId || productId,
      })
    }
  }, [isOpen, characteristic, productId, form])

  const onSubmit = (data: CharacteristicType) => {

    const parsedData = characteristicSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();
    if (data.id) formData.append('id', data.id);
    formData.append('name', data.name ?? '')
    formData.append('productId', data.productId)

    startTransition(async () => {
      const result = await createOrUpdateProductoCharacteristic(formData)

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
            {editMode ? (
              <PencilIcon className="h-6 w-6" />
            ) : (
              <PlusCircleIcon className="h-6 w-6" />
            )}
            {editMode
              ? 'Editar Característica'
              : 'Crear Nueva Característica'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Acceso a simulacros"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-8 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? editMode
                    ? 'Guardando...'
                    : 'Creando...'
                  : editMode
                    ? 'Guardar Cambios'
                    : 'Crear Característica'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
