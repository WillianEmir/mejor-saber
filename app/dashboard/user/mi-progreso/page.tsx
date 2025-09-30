import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getSimulacrosByUserId } from '@/src/lib/data/simulacro.data';
// import { Badge } from '@/src/components/dashboard/ui/badge'; // Assuming a Badge component exists
import { ArrowDown, ArrowUp, Trophy } from 'lucide-react';
import Link from 'next/link';

// Mock Card components from the previous step
const MockCard = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
    {children}
  </div>
);

// Mock Badge component if it doesn't exist
const MockBadge = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${className}`}>
    {children}
  </span>
);

const SimpleBarChart = ({ data }: { data: { score: number | null }[] }) => (
  <div className="flex items-end h-24 space-x-2 mt-4">
    {data.map((item, index) => (
      <div key={index} className="flex-1 flex flex-col items-center">
        <div 
          className="w-full bg-brand-100 dark:bg-brand-900/50 rounded-t-md hover:bg-brand-300 dark:hover:bg-brand-700 transition-colors"
          style={{ height: `${item.score || 0}%` }}
        ></div>
        <span className="text-xs text-gray-500 mt-1">{item.score?.toFixed(0) || '0'}</span>
      </div>
    ))}
  </div>
);

export default async function MiProgresoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <div>Inicia sesión para ver tu progreso.</div>;
  }

  const simulacros = await getSimulacrosByUserId(session.user.id);

  // Process data
  const progressByCompetencia: { [key: string]: { scores: (number | null)[], count: number, totalScore: number } } = {};
  simulacros.forEach(s => {
    const name = s.competencia.nombre;
    if (!progressByCompetencia[name]) {
      progressByCompetencia[name] = { scores: [], count: 0, totalScore: 0 };
    }
    progressByCompetencia[name].scores.push(s.score);
    progressByCompetencia[name].count++;
    progressByCompetencia[name].totalScore += s.score || 0;
  });

  const competenciaStats = Object.entries(progressByCompetencia).map(([name, data]) => ({
    name,
    avgScore: data.totalScore / data.count,
    lastScores: data.scores.slice(-5).map(score => ({ score })),
  })).sort((a, b) => b.avgScore - a.avgScore);

  const overallAvg = competenciaStats.length > 0 
    ? competenciaStats.reduce((acc, item) => acc + item.avgScore, 0) / competenciaStats.length
    : 0;

  const bestCompetencia = competenciaStats[0];
  const worstCompetencia = competenciaStats[competenciaStats.length - 1];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">Mi Progreso</h2>
      
      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <MockCard className="md:col-span-1 p-6 flex flex-col justify-center items-center">
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300">Puntaje General</h3>
          <div className="text-5xl font-extrabold text-brand-600 dark:text-brand-400 my-2">{overallAvg.toFixed(1)}%</div>
          <p className="text-sm text-gray-500">Promedio de todas las competencias</p>
        </MockCard>
        <MockCard className="md:col-span-1 p-6">
          <h3 className="text-lg font-medium mb-3">Mejor Área</h3>
          {bestCompetencia ? (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">{bestCompetencia.name}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{bestCompetencia.avgScore.toFixed(1)}%</p>
              </div>
            </div>
          ) : <p>No hay datos suficientes.</p>}
        </MockCard>
        <MockCard className="md:col-span-1 p-6">
          <h3 className="text-lg font-medium mb-3">Área a Mejorar</h3>
          {worstCompetencia && worstCompetencia !== bestCompetencia ? (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-full">
                <ArrowDown className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-lg">{worstCompetencia.name}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{worstCompetencia.avgScore.toFixed(1)}%</p>
              </div>
            </div>
          ) : <p>¡Vas muy bien en todo!</p>}
        </MockCard>
      </div>

      {/* Progress by Competencia */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Desempeño por Competencia</h3>
        {competenciaStats.map(stat => (
          <MockCard key={stat.name} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <h4 className="text-xl font-semibold">{stat.name}</h4>
              <div className="flex items-baseline gap-2 mt-2 md:mt-0">
                <span className="text-3xl font-bold">{stat.avgScore.toFixed(1)}%</span>
                <span className="text-sm text-gray-500">Promedio</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Tendencia de tus últimos {stat.lastScores.length} simulacros:</p>
            <SimpleBarChart data={stat.lastScores} />
          </MockCard>
        ))}
        {competenciaStats.length === 0 && (
          <MockCard className="p-8 text-center">
            <p>Aún no has completado ningún simulacro.</p>
            <Link href="/dashboard/user/simulacros" className="text-brand-500 hover:underline mt-2 inline-block">¡Empieza tu primer simulacro ahora!</Link>
          </MockCard>
        )}
      </div>
    </div>
  );
}