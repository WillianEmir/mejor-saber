import Image from "next/image";

export default function About() {
  return (
    // CONTENEDOR PRINCIPAL: Usamos padding vertical (py) para espaciado en lugar de margen.
    // Esto crea un "bloque" de sección más consistente.
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Contenedor Flex:
            - flex-col-reverse: En móvil, la imagen aparecerá PRIMERO, lo cual es más visual.
            - lg:flex-row: En pantallas grandes, cambia a formato de columnas.
            - items-center: Centra los elementos verticalmente en la vista de escritorio.
            - gap-12: Espaciado consistente (12) tanto vertical (móvil) como horizontal (escritorio).
        */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          
          {/* --- Columna de Información --- */}
          {/* lg:w-1/2: En pantallas grandes, esta columna ocupa la mitad del espacio. */}
          <div className="lg:w-1/2">
            <h1 className="
              text-3xl sm:text-4xl font-bold text-slate-800 
              text-center lg:text-left mb-6">
              Sobre Nosotros
            </h1>
            {/* Contenedor para los párrafos con espaciado vertical */}
            <div className="flex flex-col gap-y-4">
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium sequi dolores commodi debitis quasi animi placeat, delectus consectetur corrupti autem, culpa fuga necessitatibus in deleniti esse odit maxime distinctio velit.
              </p>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium sequi dolores commodi debitis quasi animi placeat, delectus consectetur corrupti autem, culpa fuga necessitatibus in deleniti esse odit maxime distinctio velit.
              </p>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Accusantium sequi dolores commodi debitis quasi animi placeat, delectus consectetur corrupti autem, culpa fuga necessitatibus in deleniti esse odit maxime distinctio velit.
              </p>
            </div>
          </div>

          {/* --- Columna de la Imagen --- */}
          {/* lg:w-1/2: En pantallas grandes, esta columna ocupa la otra mitad. */}
          <div className="lg:w-1/2 flex justify-center">
            <Image
              src='/nosotros.jpg'
              alt="Un equipo de personas colaborando en una oficina moderna"
              width={500} // El tamaño base puede ser más ajustado
              height={500}
              className="
                w-full h-auto max-w-md 
                rounded-xl shadow-xl 
                ring-1 ring-slate-200"
            />
          </div>

        </div>
      </div>
    </section>
  )
}