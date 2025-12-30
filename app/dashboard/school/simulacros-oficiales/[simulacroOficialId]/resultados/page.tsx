import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getOfficialSimulacroResults } from '../../_lib/data';

interface Props {
  params: Promise<{
    simulacroOficialId: string;
  }>;
}

export default async function SimulacroOficialResultadosPage({ params }: Props) {
  const { simulacroOficialId } = await params;

  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userSchoolId = session?.user?.schoolId;

  if (!userId || userRole !== 'ADMINSCHOOL' || !userSchoolId) {
    redirect('/auth/signin');
  }

  const results = await getOfficialSimulacroResults(simulacroOficialId, userSchoolId);

  if (!results) {
    notFound();
  }

  const { nombre, area, simulacros } = results;

  const totalParticipants = simulacros.length;
  const averageScore = totalParticipants > 0 ? simulacros.reduce((acc, s) => acc + (s.score || 0), 0) / totalParticipants : 0;
  
  // In a real scenario, you'd calculate completion rate against total students of the school.
  // For now, we'll just display the number of participants.

  return (
    <div className="container mx-auto p-4">
      <Link href="/dashboard/school/simulacros-oficiales" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Volver a la lista de simulacros
      </Link>
      <h1 className="text-3xl font-bold mb-2">Resultados: {nombre}</h1>
      <p className="text-xl text-gray-600 mb-6">Área: {area.nombre}</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Participantes</h3>
          <p className="text-3xl font-bold">{totalParticipants}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Puntaje Promedio</h3>
          <p className="text-3xl font-bold">{averageScore.toFixed(2)}%</p>
        </div>
      </div>
      
      {/* Results Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Resultados por Estudiante</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Estudiante</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Puntaje</th>
                <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {simulacros.map(simulacro => (
                <tr key={simulacro.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{simulacro.user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{simulacro.user.email}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">{simulacro.score?.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{new Date(simulacro.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
