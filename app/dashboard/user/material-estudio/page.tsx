import { Search, BookCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getAllAreasWithContenidos } from '@/src/lib/data/study-material.data';

// --- Componentes de UI (definidos aquí para ser autocontenidos) ---
const Accordion = ({ children }: { children: React.ReactNode }) => <div className="space-y-3">{children}</div>;

const AccordionItem = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <details className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
    <summary className="p-4 flex items-center justify-between cursor-pointer font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-center gap-4">
        {icon}
        {title}
      </div>
      <svg className="h-6 w-6 transform transition-transform duration-200 group-open:rotate-180 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
      {children}
    </div>
  </details>
);

const SubAccordionItem = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <details className="group bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
    <summary className="p-3 flex items-center justify-between cursor-pointer font-medium text-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {title}
      <ChevronRight className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-90 text-gray-500" />
    </summary>
    <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-600">
      {children}
    </div>
  </details>
);

const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div 
          className="h-2 rounded-full transition-all duration-500"
          style={{ 
            width: `${progress}%`,
            backgroundColor: progress > 70 ? '#22c55e' : progress > 40 ? '#f59e0b' : '#ef4444'
          }}
        ></div>
    </div>
);
// --- Fin de Componentes de UI ---

export default async function MaterialEstudioPage() {
  const areas = await getAllAreasWithContenidos();

  // Placeholder for mastery. In a real app, this would come from user progress data.
  const getMastery = () => Math.floor(Math.random() * 61) + 40; // Random mastery between 40-100%

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Material de Estudio</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-1">Explora los temas, revisa el contenido y prepárate para tus pruebas.</p>

      {/* Barra de Búsqueda y Filtro */}
      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Buscar un tema o contenido..."
          className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 focus:ring-2 focus:ring-brand-500 outline-none"
        />
      </div>

      {/* Acordeón de Contenidos */}
      <div className="mt-8">
        <Accordion>
          {areas.map(area => (
            <AccordionItem key={area.id} title={area.nombre} icon={<BookCheck className="h-6 w-6 text-brand-500" />}>
              <div className="space-y-2 py-2">
                {area.contenidosCurriculares.length > 0 ? (
                  area.contenidosCurriculares.map(contenido => (
                    <SubAccordionItem key={contenido.id} title={contenido.nombre}>
                      <div className="space-y-1 pt-2">
                        {contenido.ejesTematicos.length > 0 ? (
                          contenido.ejesTematicos.map(eje => {
                            const mastery = getMastery();
                            return (
                              <div key={eje.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{eje.nombre}</span>
                                <div className="flex items-center gap-3">
                                  <ProgressBar progress={mastery} />
                                  <span className="text-xs font-bold w-10 text-right text-gray-600 dark:text-gray-400">{mastery}%</span>
                                  <Link href={`/dashboard/user/material-estudio/${eje.id}`}>
                                    <span className="px-3 py-1 text-xs font-semibold text-white bg-brand-600 rounded-md hover:bg-brand-700 transition-colors cursor-pointer">
                                      Estudiar
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            )
                          })
                        ) : (
                          <p className="text-center text-sm text-gray-500 py-3">No hay ejes temáticos para este contenido.</p>
                        )}
                      </div>
                    </SubAccordionItem>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No hay contenidos curriculares para esta área todavía.</p>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}