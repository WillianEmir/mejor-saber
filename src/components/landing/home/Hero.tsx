import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-(--color-principal)">
              Tu Mejor Puntaje SABER 11 Comienza Aquí
            </h1>
            <br />
            <p className="text-lg sm:text-xl text-gray-600 mb-8">
              Prepárate con los mejores y obtén un puntaje que te permita acceder a las mejores carreras en las mejores universidades.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/dashboard"
                className="inline-block rounded-lg bg-(--color-principal) px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-(--color-principal-hover) focus:outline-none focus:ring-2 focus:ring-(--color-principal) focus:ring-offset-2 transition"
              >
                Empieza Gratis
              </a>
              <a
                href="#"
                className="inline-block text-base font-semibold text-(--color-principal) hover:underline transition"
              >
                Más Información <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full h-64 sm:h-96 lg:h-[32rem] rounded-md overflow-hidden shadow-lg">
              <Image
                src="/hero.jpg"
                alt="Imagen de freepik"
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
