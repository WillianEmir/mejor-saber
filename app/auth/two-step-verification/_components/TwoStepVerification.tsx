'use client' 

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { NewPasswordTwoStepVerificationSchema, NewPasswordTwoStepVerificationType } from '../_lib/twoStepVerification.schema'
import { newPasswordTwoStepVerification } from '@/app/auth/two-step-verification/_lib/twoStepVerification.actions'

import { Button } from '@/src/components/ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'

export default function TwoStepVerification() {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<NewPasswordTwoStepVerificationType>({
    defaultValues: {
      password: '',
      token: '',
    },
  })

  const onSubmit = (data: NewPasswordTwoStepVerificationType) => {

    const parsedData = NewPasswordTwoStepVerificationSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        if (issue.path && issue.path.length > 0) {
            form.setError(issue.path[0] as any, { message: issue.message });
        }
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    formData.append('password', data.password);
    formData.append('token', data.token);

    startTransition(async () => {
      const result = await newPasswordTwoStepVerification(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset()
        router.push('/auth/signin')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Crea una Nueva Contraseña
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ingresa tu nueva contraseña a continuación.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificación</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Tu código de verificación"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Confirmando...' : 'Confirmar Nueva Contraseña'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}