import Link from 'next/link';
import { Button } from '@/src/components/ui/Button'; 

export default function CTA() {
  return (
    <div className="bg-white dark:bg-neutral-dark">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-primary dark:bg-primary/10 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Listo para transformar tu futuro?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-neutral-light dark:text-neutral-light">
            Únete a los miles de estudiantes que han alcanzado sus metas con nuestra plataforma. Tu mejor puntaje está a solo un clic de distancia.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/dashboard">
              <Button className="bg-white text-primary hover:bg-indigo-50 text-lg">Empieza Gratis</Button>
            </Link>
            <Link href="/precios" className="text-lg font-semibold leading-6 text-white">
              Ver Precios <span aria-hidden="true">→</span>
            </Link>
          </div>
          {/* Efecto de fondo */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
            <defs>
              <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
