
'use client';

import { getScoreDistributionByArea } from "@/app/dashboard/admin/_lib/admin.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BarChart, BarChartDataType } from "@/src/components/ui/charts/BarChart";

interface ScoreDistributionProps {
  scoreDistribution: Awaited<ReturnType<typeof getScoreDistributionByArea>>;
} 

export const ScoreDistribution = ({ scoreDistribution }: ScoreDistributionProps) => {
  const chartData = (areaName: string, distribution: number[]): BarChartDataType => ({
    labels: ['0-20', '21-40', '41-60', '61-80', '81-100'],
    datasets: [
      {
        label: `Distribución de puntajes en ${areaName}`,
        data: distribution,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución de Puntajes por Área</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scoreDistribution.map((item) => (
          <div key={item.area}>
            <h3 className="font-semibold">{item.area}</h3>
            <div className="h-64">
              <BarChart data={chartData(item.area, item.distribution)} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
