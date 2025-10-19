import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export default function Hero() {
  return (
    <section className="py-20 sm:py-28 lg:py-36 dark:bg-neutral-dark relative">
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-3xl lg:text-6xl font-extrabold tracking-tight text-neutral-dark leading-tight dark:text-neutral-light">
              Tu <span className="text-primary">Mejor</span> Puntaje <span className="text-primary">SABER 11</span> Comienza Aquí
            </h1>

            <p className="mt-6 text-lg text-neutral-dark dark:text-neutral-light max-w-xl mx-auto lg:mx-0">
              Prepárate con los mejores y obtén un puntaje que te permita acceder a las mejores carreras en las mejores universidades.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <Link href="/dashboard">
                <Button
                  className=" text-white"
                >Empieza Gratis</Button>
              </Link>
              <Link
                href="/precios"
                className="inline-flex items-center text-base font-semibold text-neutral-dark dark:text-neutral-light hover:text-primary transition-colors duration-normal"
              >
                Ver Precios <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-full h-80 sm:h-96 lg:h-[30rem] rounded-xl overflow-hidden shadow-lg dark:shadow-neutral-500">
              <Image
                src="/hero.jpg"
                alt="Estudiantes preparándose para el examen Saber 11"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}