'use client'

import { useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/src/components/ui/dialog'
import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/src/components/ui/form'
import { createManualOrder } from '../_lib/order.actions'
import { ManualOrderSchema, ManualOrderType } from '../_lib/order.schema'

interface ManualPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  paymentMethod: string
  productId: string
  userId: string
  totalAmount: number
  schoolName?: string
  daneCode?: string
  numberOfStudents?: number
}

export default function ManualPaymentModal({
  isOpen,
  onClose,
  paymentMethod,
  productId,
  userId,
  totalAmount,
  schoolName,
  daneCode,
  numberOfStudents,
}: ManualPaymentModalProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ManualOrderType>({
    defaultValues: {
      productId: productId,
      userId: userId,
      totalAmount: totalAmount,
      referenciaPago: '',
      paymentMethod: paymentMethod,
      schoolName: schoolName || '',
      daneCode: daneCode || '',
      numberOfStudents: numberOfStudents || 1,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        productId: productId,
        userId: userId,
        totalAmount: totalAmount,
        referenciaPago: '',
        paymentMethod: paymentMethod,
        schoolName: schoolName || '',
        daneCode: daneCode || '',
        numberOfStudents: numberOfStudents || 1,
      })
    }
  }, [isOpen, productId, userId, totalAmount, form, schoolName, daneCode, numberOfStudents, paymentMethod])

  const getPaymentInstructions = (method: string) => {
    // ... (same as before, no changes needed here)
    switch (method) {
      case 'Transferencia a Nequi':
        return (
          <>
            <p>Por favor, realiza la transferencia a la cuenta Nequi:</p>
            <p className="font-bold text-lg">300 XXX XXXX</p>
            <p>A nombre de: Tu Nombre Completo</p>
            <p>Valor a pagar: ${totalAmount.toLocaleString()}</p>
            <p className="mt-4">Una vez realizada la transferencia, ingresa el número de referencia o comprobante en el campo de abajo.</p>
          </>
        )
      case 'Con código QR desde tu banca móvil':
        return (
          <>
            <p>Escanea el siguiente código QR desde tu aplicación bancaria para realizar el pago:</p>
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              QR Code Placeholder
            </div>
            <p>Valor a pagar: ${totalAmount.toLocaleString()}</p>
            <p className="mt-4">Después de pagar, ingresa el número de referencia o comprobante.</p>
          </>
        )
      case 'Llave Bancaria':
        return (
          <>
            <p>Por favor, realiza la transferencia usando la siguiente llave bancaria:</p>
            <p className="font-bold text-lg">Banco: @MejorSaber</p>
            <p>A nombre de: Mejor Saber</p>
            <p>Valor a pagar: ${totalAmount.toLocaleString()}</p>
            <p className="mt-4">Una vez realizada la transferencia, ingresa el número de referencia o comprobante en el campo de abajo.</p>
          </>
        )
      default:
        return <p>Instrucciones de pago no disponibles para este método.</p>
    }
  }

  const onSubmit = (data: ManualOrderType) => {

    const parsedData = ManualOrderSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach((issue) => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    formData.append('productId', data.productId)
    formData.append('userId', data.userId)
    formData.append('totalAmount', String(data.totalAmount))
    formData.append('referenciaPago', data.referenciaPago)
    formData.append('paymentMethod', data.paymentMethod)
    if (data.schoolName) formData.append('schoolName', data.schoolName)
    if (data.daneCode) formData.append('daneCode', data.daneCode)
    if (data.numberOfStudents) formData.append('numberOfStudents', String(data.numberOfStudents))


    startTransition(async () => {
      const result = await createManualOrder(formData)
      if (result.success) {
        toast.success(result.message)
        onClose()
        // TODO: Redireccionar al usuario a un lugar lindo
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Pago con {paymentMethod}
          </DialogTitle>
          <DialogDescription className="text-center">
            Sigue las instrucciones para completar tu pago y luego ingresa la referencia.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-blue-800 dark:text-blue-200">
            {getPaymentInstructions(paymentMethod)}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...form.register('productId')} />
              <input type="hidden" {...form.register('userId')} />
              <input type="hidden" {...form.register('totalAmount')} />
              <input type="hidden" {...form.register('paymentMethod')} />
              <input type="hidden" {...form.register('schoolName')} />
              <input type="hidden" {...form.register('daneCode')} />
              <input type="hidden" {...form.register('numberOfStudents')} />

              <FormField
                control={form.control}
                name="referenciaPago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia de Pago / Comprobante</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: 1234567890"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                  {isPending ? 'Creando Orden...' : 'Generar Orden'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
