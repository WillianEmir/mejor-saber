'use client'

import { useTransition } from 'react' 
import Link from 'next/link'
import { useForm } from 'react-hook-form' 
import { toast } from 'sonner'
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'
import { useRouter } from 'next/navigation'

import { ResetSchema, ResetType } from '@/app/auth/reset-password/_lib/resetPassword.schema'
import { reset } from '@/app/auth/reset-password/_lib/resetPassword.actions'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/Button'

export default function ResetPasswordForm() {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<ResetType>({
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (data: ResetType) => {
    const parsedData = ResetSchema.safeParse(data)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData();
    formData.append('email', data.email);

    startTransition(async () => {
      const result = await reset(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset()
        router.push('/auth/two-step-verification')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <>
      <div className='grid lg:grid-cols-2 max-md:p-3'>
        <div className='flex flex-col items-center justify-center w-full h-screen'>
          <div className='w-full max-w-md sm:pt-10 mx-auto mb-5'>
            <Link
              href='/'
              className='inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            >
              <ChevronLeftIcon className='size-6' />
              Volver al Inicio
            </Link>
          </div>

          <div className='flex flex-col justify-center flex-1 h-screen w-full max-w-md mx-auto'>
            <div className='mb-5 sm:mb-8'>
              <h1 className='mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md'>
                ¿Olvidaste Tu Contraseña?
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Ingresa la dirección de correo electrónico vinculada a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
              </p>
            </div>

            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-6'
                >
                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email <span className='text-red-500'>*</span>{' '}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder='john.doe@example.com'
                              type='email'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    disabled={isPending}
                    type='submit'
                    className='w-full'
                  >
                    {isPending ? 'Enviando...' : 'Enviar Enlace de Reinicio'}
                  </Button>
                </form>
              </Form>

              <div className='mt-5'>
                <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                  Espera, recuerdo mi contraseña...{' '}
                  <Link
                    href='/auth/signin'
                    className='font-semibold text-blue-600 hover:text-blue-700'
                  >
                    Iniciar Sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-blue-100 dark:bg-gray-800 w-full hidden lg:block'></div>
      </div>
    </>
  )
}
