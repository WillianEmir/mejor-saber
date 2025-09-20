import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getAdminDashboardStats, getQuestionCountHierarchy } from '@/src/lib/data/admin.data';
import { Users, HelpCircle, Book, School, Folder, File, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const StatCard = ({ icon: Icon, title, value, subtext }: { icon: React.ElementType, title: string, value: string, subtext: string }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex flex-row items-center justify-between pb-2">
      <h3 className="text-sm font-medium tracking-tight">{title}</h3>
      <Icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
    </div>
    <div>
      <div className="text-3xl font-bold">{value}</div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
    </div>
  </div>
);

const QuestionHierarchy = ({ hierarchy }: { hierarchy: Awaited<ReturnType<typeof getQuestionCountHierarchy>> }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <h3 className="text-xl font-bold mb-4 px-2">Distribución de Preguntas</h3>
    <div className="space-y-2">
      {hierarchy.map(area => (
        <details key={area.id} className="group rounded-lg bg-gray-50 dark:bg-gray-700/50">
          <summary className="p-3 flex items-center justify-between cursor-pointer font-semibold text-gray-700 dark:text-gray-200">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-brand-500" />
              <span>{area.nombre}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">{area.preguntaCount} preguntas</span>
              <ChevronRight className="h-5 w-5 transform transition-transform group-open:rotate-90" />
            </div>
          </summary>
          <div className="pl-8 pr-2 pb-2 space-y-1">
            {area.competencias.map(competencia => (
              <details key={competencia.id} className="group rounded-lg bg-gray-100 dark:bg-gray-700">
                <summary className="p-2 flex items-center justify-between cursor-pointer font-medium text-sm">
                  <div className="flex items-center gap-3">
                    <Folder className="h-4 w-4 text-sky-500" />
                    <span>{competencia.nombre}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">{competencia.preguntaCount}</span>
                    <ChevronRight className="h-4 w-4 transform transition-transform group-open:rotate-90" />
                  </div>
                </summary>
                <div className="pl-8 pr-2 pb-2 space-y-1">
                  {competencia.afirmaciones.map(afirmacion => (
                    <details key={afirmacion.id} className="group rounded-lg bg-gray-200 dark:bg-gray-600/80">
                      <summary className="p-2 flex items-center justify-between cursor-pointer font-normal text-sm">
                        <div className="flex items-center gap-3">
                          <Folder className="h-4 w-4 text-amber-500" />
                          <span>{afirmacion.nombre}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">{afirmacion.preguntaCount}</span>
                          <ChevronRight className="h-4 w-4 transform transition-transform group-open:rotate-90" />
                        </div>
                      </summary>
                      <div className="pl-8 pr-2 py-1">
                        {afirmacion.evidencias.map(evidencia => (
                          <div key={evidencia.id} className="p-1.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-3">
                              <File className="h-3 w-3" />
                              <span>{evidencia.nombre}</span>
                            </div>
                            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-300 text-gray-800 dark:bg-gray-500 dark:text-gray-200">{evidencia.preguntaCount}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  </div>
);

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getAdminDashboardStats();
  const hierarchy = await getQuestionCountHierarchy();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Dashboard de Administración
      </h2>
      <p className="text-gray-600 dark:text-gray-400">Vista general del estado de la aplicación.</p>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} title="Usuarios Totales" value={stats.userCount.toString()} subtext="Usuarios registrados en el sistema" />
        <StatCard icon={HelpCircle} title="Preguntas Totales" value={stats.questionCount.toString()} subtext="Preguntas en la base de datos" />
        <StatCard icon={Book} title="Simulacros Realizados" value={stats.simulacroCount.toString()} subtext="Sesiones completadas por usuarios" />
        <StatCard icon={School} title="Colegios Registrados" value={stats.schoolCount.toString()} subtext="Instituciones afiliadas" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Hierarchy */}
        <div className="lg:col-span-2">
          <QuestionHierarchy hierarchy={hierarchy} />
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                    <Link href="/dashboard/admin/users" className="block w-full text-left p-3 font-semibold bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Gestionar Usuarios</Link>
                    <Link href="/dashboard/admin/preguntas" className="block w-full text-left p-3 font-semibold bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Gestionar Preguntas</Link>
                    <Link href="/dashboard/admin/areas" className="block w-full text-left p-3 font-semibold bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Gestionar Áreas y Competencias</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}