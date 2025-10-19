import Hero from "@/app/(landingpage)/components/Hero"; 
import SectionBeneficios from "@/app/(landingpage)/components/SectionBeneficios";
import SectionDestacados from "@/app/(landingpage)/components/SectionDestacados";
import SectionObjetivos from "@/app/(landingpage)/components/SectionObjetivos";
import Testimonials from "@/app/(landingpage)/components/Testimonials/Testimonials";
import CTA from "@/app/(landingpage)/components/CTA";
import { getPublicTestimonios } from "../dashboard/admin/testimonios/lib/testimonio.data";
import { notFound } from "next/navigation";

export default async function Home() {

  const testimonios = await getPublicTestimonios()

  if(!testimonios) return notFound()

  return ( 
    <>
      <Hero />
      <SectionDestacados />
      <SectionObjetivos />
      <SectionBeneficios />
      <Testimonials testimonios={testimonios} />
      <CTA />
    </>
  );
}