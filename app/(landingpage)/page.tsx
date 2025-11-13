import Hero from '@/app/(landingpage)/_components/Hero'
import SectionBeneficios from '@/app/(landingpage)/_components/SectionBeneficios'
import SectionDestacados from '@/app/(landingpage)/_components/SectionDestacados'
import SectionObjetivos from '@/app/(landingpage)/_components/SectionObjetivos'
import Testimonials from '@/app/(landingpage)/_components/Testimonials/Testimonials'
import CTA from '@/app/(landingpage)/_components/CTA'
import { getPublicTestimonios } from '../dashboard/admin/testimonios/_lib/testimonio.data'

export default async function Home() {
  const testimonios = await getPublicTestimonios()

  return (
    <>
      <Hero />
      <SectionDestacados />
      <SectionObjetivos />
      <SectionBeneficios />
      {testimonios && testimonios.length > 0 && <Testimonials testimonios={testimonios} />}
      <CTA />
    </>
  )
}