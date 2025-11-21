'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'; 
import { BarChart } from '@/src/components/ui/charts/BarChart';
import { CompetencyBarChartDataType } from '../../_lib/reports.data';

interface CompetencyChartsProps {
  filteredCompetencyChartData: CompetencyBarChartDataType[];
}

export default function CompetencyCharts({ filteredCompetencyChartData }: CompetencyChartsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Resultados por Competencia</h2>
      <div className="grid grid-cols-1 gap-6">
        {filteredCompetencyChartData.map(data => (
          <Card key={data.area}>
            <CardHeader>
              <CardTitle>{data.area}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart data={data.chartData} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
