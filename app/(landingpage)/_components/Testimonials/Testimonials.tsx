'use client'

import { useState } from 'react'
import { TestimonioType } from '@/app/dashboard/admin/testimonios/_lib/testimonio.schema'
import { useCurrentUser } from '@/src/hooks/use-current-user'
import { Button } from '@/src/components/ui/Button'
import AddTestimonialModal from './AddTestimonialModal'

interface TestimonialsProps { 
  testimonios: TestimonioType[]
}

export default function Testimonials({ testimonios }: TestimonialsProps) {
  const { status } = useCurrentUser()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section id="testimonios" className="relative isolate bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="ml-[max(50%,38rem)] aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#80caff] to-[#4f46e5]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-blue-600 dark:text-blue-400">
            Testimonios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Lo que nuestra comunidad dice de nosotros
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 dark:text-white sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonios.slice(0, 4).map((testimonial) => (
            <figure
              key={testimonial.id}
              className="rounded-2xl bg-white dark:bg-gray-800/50 shadow-lg ring-1 ring-gray-900/5 p-8"
            >
              <blockquote className="text-gray-900 dark:text-white">
                <p>{`“${testimonial.comentario}”`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <div className="font-semibold">{`${testimonial.user.name} ${testimonial.user.lastName || ''}`}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        {status === 'authenticated' && (
          <div className="mt-16 text-center">
            <Button onClick={() => setIsModalOpen(true)}>Deja tu testimonio</Button>
          </div>
        )}
      </div>
      <AddTestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}
