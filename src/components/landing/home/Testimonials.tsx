import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-20 lg:px-8 border-b border-slate-100">

      {/* Título */}
      <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-16">
        Testimonios
      </h1>

      {/* Tarjetas de testimonios */}
      <div className="container mx-auto grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-white shadow-lg ring-1 ring-gray-200 p-6 transition hover:shadow-xl"
          >
            <figure className="text-center">
              <blockquote className="text-gray-700 text-base sm:text-lg italic">
                <p>
                  “Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo expedita voluptas culpa sapiente alias
                  molestiae. Numquam corrupti in laborum sed rerum et corporis.”
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <Image
                  alt="Foto de Judith Black"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="mx-auto h-12 w-12 rounded-full object-cover"
                  width={48}
                  height={48}
                />
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Judith Black</span>
                  <svg width={4} height={4} viewBox="0 0 4 4" aria-hidden="true" className="fill-gray-400">
                    <circle cx={2} cy={2} r={2} />
                  </svg>
                  <span>CEO de Workcation</span>
                </div>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </section>
  );
}
