'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon'

import { Button } from '../../ui/Button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../ui/form'
import { Input } from '../../ui/input'
import { FormError } from './FormError'
import { FormSuccess } from './FormSuccess'
import { ResetSchema } from '@/src/lib/schemas/auth.schema'
import { reset } from '@/src/lib/actions/auth.actions'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)

        if (data?.success) {
          router.push('/auth/two-step-verification')
        }
      })
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
                Olvidaste Tu Contraseña?
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Ingrese la dirección de correo electrónico vinculada a su cuenta y le enviaremos un enlace para restablecer su contraseña.
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
                            Email <span className='text-error-500'>*</span>{' '}
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
                  <FormError message={error} />
                  <FormSuccess message={success} />
                  <Button
                    disabled={isPending}
                    type='submit'
                    className='w-full'
                  >
                    Enviar Enlace de Reinicio
                  </Button>
                </form>
              </Form>

              <div className='mt-5'>
                <p className='text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start'>
                  Espera, recuerdo mi contraseña{''}
                  <Link
                    href='/auth/signin'
                    className='text-brand-500 hover:text-brand-600 dark:text-brand-400'
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-blue-light-100 w-full hidden lg:block'></div>
      </div>
    </>
  )
}
