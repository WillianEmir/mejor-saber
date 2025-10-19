import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
// import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/dashboard/ui/card'; // Assuming these components exist
import { BookOpen, BrainCircuit, ClipboardList, Target } from 'lucide-react';
import Link from 'next/link';
import { getSimulacrosByUserId } from './simulacros/lib/simulacro.data';

// Mock Card components if they don't exist
const MockCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {children}
  </div>
);

const MockCardHeader = ({ children }: { children: React.ReactNode }) => <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">{children}</div>;
const MockCardTitle = ({ children }: { children: React.ReactNode }) => <h3 className="tracking-tight text-sm font-medium">{children}</h3>;
const MockCardContent = ({ children }: { children: React.ReactNode }) => <div className="p-6 pt-0">{children}</div>;

export default async function UserDashboardPage() { 
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Inicia sesión para ver tu dashboard.</div>;
  }

  const simulacros = await getSimulacrosByUserId(session.user.id);

  const totalSimulacros = simulacros.length;
  const averageScore = totalSimulacros > 0
    ? simulacros.reduce((acc, s) => acc + (s.score || 0), 0) / totalSimulacros
    : 0;

  const StatCard = ({ icon: Icon, title, value, subtext }: { icon: React.ElementType, title: string, value: string, subtext: string }) => (
    <MockCard> 
      <MockCardHeader>
        <MockCardTitle>{title}</MockCardTitle>
        <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      </MockCardHeader>
      <MockCardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtext}</p>
      </MockCardContent>
    </MockCard>
  );

  const ActionCard = ({ icon: Icon, title, href }: { icon: React.ElementType, title: string, href: string }) => (
    <Link href={href} className="block hover:scale-105 transition-transform duration-200">
      <MockCard className="flex flex-col items-center justify-center p-6 text-center">
        <Icon className="h-12 w-12 mb-4 text-brand-500" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      </MockCard>
    </Link>
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          ¡Bienvenido, {session.user.firstName}!
        </h2>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={ClipboardList}
          title="Simulacros Realizados"
          value={totalSimulacros.toString()}
          subtext="Total de simulacros completados"
        />
        <StatCard 
          icon={Target}
          title="Puntaje Promedio"
          value={`${averageScore.toFixed(1)}%`}
          subtext="Promedio de todos tus simulacros"
        />
        <StatCard 
          icon={BrainCircuit}
          title="Áreas de Práctica"
          value="5"
          subtext="Competencias disponibles"
        />
        <StatCard 
          icon={BookOpen}
          title="Material de Repaso"
          value="12"
          subtext="Temas y guías disponibles"
        />
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <ActionCard 
          icon={ClipboardList}
          title="Iniciar Nuevo Simulacro"
          href="/dashboard/user/simulacros"
        />
        <ActionCard 
          icon={BookOpen}
          title="Explorar Material de Repaso"
          href="/dashboard/user/material-repaso"
        />
        <ActionCard 
          icon={BrainCircuit}
          title="Ver Mi Progreso"
          href="/dashboard/user/mi-progreso"
        />
      </div>

      {/* Recent Simulacros Table */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Simulacros Recientes</h3>
        <MockCard>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Competencia</th>
                  <th scope="col" className="px-6 py-3">Área</th>
                  <th scope="col" className="px-6 py-3">Puntaje</th>
                  <th scope="col" className="px-6 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {simulacros.slice(0, 5).map((simulacro) => (
                  <tr key={simulacro.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {simulacro.competencia.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                        {simulacro.competencia.area.nombre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${simulacro.score && simulacro.score >= 60 ? 'text-green-500' : 'text-red-500'}`}>
                        {simulacro.score?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(simulacro.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {totalSimulacros === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8">No has completado ningún simulacro todavía.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </MockCard>
      </div>
    </div>
  );
}