'use client'

import { Card, CardContent } from '@/src/components/ui/card';
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart';

interface AreaChartProps { 
  displayChartData: BarChartDataType | undefined;
}

export default function AreaChart({ displayChartData }: AreaChartProps) { 
  return (
    <Card>
      <CardContent className="h-[500px]">
        {displayChartData ? (
          <BarChart data={displayChartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Cargando datos...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
