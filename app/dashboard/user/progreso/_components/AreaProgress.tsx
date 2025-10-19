'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { BarChart } from '@/src/components/ui/charts/BarChart'

interface AreaProgressProps {
  chartData: any;
}

export default function AreaProgress({ chartData }: AreaProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rendimiento por Áreas</CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <BarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
