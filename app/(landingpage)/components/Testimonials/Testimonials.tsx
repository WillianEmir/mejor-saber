'use client'

import { TestimonioType } from '@/app/dashboard/admin/testimonios/lib/testimonio.schema';
import Image from 'next/image';
import { useCurrentUser } from '@/src/hooks/use-current-user';
import { Button } from '@/src/components/ui/Button';
import { useState } from 'react';
import AddTestimonialModal from './AddTestimonialModal'; 

interface TestimonialsProps {
  testimonios: TestimonioType[]
}

export default function Testimonials({testimonios} : TestimonialsProps) {
  const { data: session, status } = useCurrentUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="dark:bg-neutral-dark py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary dark:text-neutral-light sm:text-2xl">
            Testimonios
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-neutral-dark dark:text-neutral-light sm:text-4xl">
            Lo que nuestra comunidad dice de nosotros
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3">
            {testimonios.map((testimonial) => (
              <div key={testimonial.id} className="rounded-2xl bg-gray-50 dark:bg-neutral-light/10 p-4 shadow-lg ring-1 ring-gray-900/5">
                <figure>
                  <blockquote className="text-lg font-medium leading-6 text-neutral-dark dark:text-neutral-light">
                    <p>{`“${testimonial.comentario}”`}</p>
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-x-4">
                    {/* <Image
                      className="h-12 w-12 rounded-full bg-gray-50 object-cover"
                      src={testimonial.avatar}
                      alt={`Foto de ${testimonial.name}`}
                      width={48}
                      height={48}
                    /> */}
                    <div>
                      <div className="font-semibold text-neutral-dark dark:text-neutral-light">{`${testimonial.user.firstName} ${testimonial.user.lastName || ''}`}</div>
                      {/* <div className="text-neutral-dark/80 dark:text-neutral-light/80">{testimonial.role}</div> */}
                    </div>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
        {status === 'authenticated' && (
          <div className="mt-16 text-center">
            <Button onClick={() => setIsModalOpen(true)}>
              Deja tu testimonio
            </Button>
          </div>
        )}
      </div>
      <AddTestimonialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
