import { getScoreDistributionData } from "./_lib/school.data";

import SchoolProgressChart from "./_components/SchoolProgressChart";
import SchoolStatsCards from "./_components/SchoolStatsCards";
import { notFound } from "next/navigation";

export default async function SchoolDashboardPage() { 

  const scoreDistribution = await getScoreDistributionData();

  if (!scoreDistribution) notFound()
 
  const chartData = {
    labels: ['Puntaje Inicial', 'Promedio General', 'Puntaje Actual'],
    datasets: [
      {
        label: 'Progreso de la Escuela',
        data: [
          scoreDistribution.firstSimulacroAvg,
          scoreDistribution.overallAvg,
          scoreDistribution.lastSimulacroAvg,
        ],
        backgroundColor: ['#ef4444', '#eab308', '#22c55e'],
      },
    ],
  };

  return (
    <div className="space-y-4">
      <SchoolStatsCards />
      <SchoolProgressChart chartData={chartData} />
    </div>
  );
}
