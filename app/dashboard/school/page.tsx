import { BarChart, Users, Target, ClipboardList, Percent, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getSchoolDashboardData } from '@/src/lib/data/school.data';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// --- Componentes de UI ---
const StatCard = ({ icon: Icon, title, value, subtext }: { icon: React.ElementType, title: string, value: string, subtext: string }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium tracking-tight text-gray-500 dark:text-gray-400">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
  </div>
);

const SimpleBarChart = ({ data }: { data: { name: string, avg: number }[] }) => (
    <div className="h-60 w-full p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-end h-full space-x-4">
            {data.map((item) => (
                <div key={item.name} className="flex-1 flex flex-col items-center">
                    <div 
                        className="w-full bg-brand-200 dark:bg-brand-900/50 rounded-t-md hover:bg-brand-400 dark:hover:bg-brand-700 transition-colors"
                        style={{ height: `${item.avg}%` }}
                    ></div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-2 text-center">{item.name}</span>
                </div>
            ))}
        </div>
    </div>
);
// --- Fin de Componentes de UI ---


export default async function SchoolDashboardPage() {
  const session = await getServerSession(authOptions);
  // const schoolId = session?.user?.schoolId; // You'd get the schoolId from the session
  // if (!schoolId) return <div>No estás asociado a ningún colegio.</div>;

  // Usando datos de ejemplo por ahora
  const { schoolName, stats, performanceByCompetencia, topStudents } = await getSchoolDashboardData("mock-id");

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Dashboard de {schoolName}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">Resumen del rendimiento y actividad de tus estudiantes.</p>

      {/* Tarjetas de Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} title="Nº de Estudiantes" value={stats.studentCount.toString()} subtext="Estudiantes registrados" />
        <StatCard icon={Target} title="Promedio General" value={`${stats.averageScore}%`} subtext="En todos los simulacros" />
        <StatCard icon={ClipboardList} title="Simulacros Completados" value={stats.simulacrosCount.toString()} subtext="Total de sesiones finalizadas" />
        <StatCard icon={Percent} title="Tasa de Participación" value={`${stats.participationRate}%`} subtext="Estudiantes activos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Rendimiento */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Rendimiento Promedio por Competencia</h3>
          <SimpleBarChart data={performanceByCompetencia} />
        </div>

        {/* Estudiantes Destacados y Acciones */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Estudiantes Destacados</h3>
            <ul className="space-y-3">
              {topStudents.map((student, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className={`h-5 w-5 ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{student.name}</span>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-white">{student.score}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Acciones</h3>
            <div className="space-y-3">
              <Link href="/dashboard/school/students" className="block w-full text-center p-3 font-semibold bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200 rounded-lg hover:bg-brand-200 dark:hover:bg-brand-900">Gestionar Estudiantes</Link>
              <Link href="/dashboard/school/reports" className="block w-full text-center p-3 font-semibold bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">Ver Reportes Detallados</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}