'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {  MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'

import { Button } from '@/src/components/ui/Button'
import { Input } from '@/src/components/ui/input'
import { Textarea } from '@/src/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'

import { sendContactEmail } from '@/app/(landingpage)/contacto/_lib/contact.actions'
import { ContactSchema, type ContactFormType } from '@/app/(landingpage)/contacto/_lib/contact.schema'
import { MailIcon } from 'lucide-react'

const contactInfo = [
  { icon: MailIcon, text: 'soporte@tudominio.com' },
  { icon: MapPinIcon, text: 'Calle 123 #45-67, Bogotá, Colombia' },
  { icon: PhoneIcon, text: '+57 (311) 555-1234' },
]

export default function ContactPage() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormType>({
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (data: ContactFormType) => {

    const parsedData = ContactSchema.safeParse(data)
    
    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('email', data.email)
    formData.append('message', data.message)

    startTransition(async () => {
      const result = await sendContactEmail(formData)
      if (result.success) {
        toast.success(result.message)
        form.reset()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/50 min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            ¡Hablemos!
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a prepararte para tus exámenes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Información de Contacto</h2>
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="tu.correo@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe tu mensaje aquí..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-right">
                    <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                      {isPending ? 'Enviando...' : 'Enviar Mensaje'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}