import Hero from "@/src/components/landing/home/Hero";
import SectionBeneficios from "@/src/components/landing/home/SectionBeneficios";
import SectionDestacados from "@/src/components/landing/home/SectionDestacados";
import SectionObjetivos from "@/src/components/landing/home/SectionObjetivos";
import Testimonials from "@/src/components/landing/home/Testimonials";

export default function Home() {
  return (
    <> 
      <Hero />
      <SectionDestacados />
      <SectionBeneficios />
      <SectionObjetivos />
      <Testimonials />

      <div className=" flex flex-col items-center justify-center gap-4 text-center bg-white py-5">

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-md transition-colors duration-200 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Empieza Gratis
          </a>

          <a
            href="/dashboard"
            className="text-sm font-medium text-indigo-600 hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Más Información <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

    </>
  );
}
