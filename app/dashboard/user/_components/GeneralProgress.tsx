'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'  
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart'

interface GeneralProgressProps { 
  chartData:  BarChartDataType ;
}

export default function GeneralProgress({ chartData }: GeneralProgressProps) {
  
  const initialScore = chartData.datasets[0].data[0]; 
  const finalScore = chartData.datasets[0].data[2];
  const progress = finalScore - initialScore;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Progreso General</CardTitle>
      </CardHeader>
      <CardContent className="md:grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-96">
          <BarChart data={chartData} />
        </div>
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Progreso Neto</h3>
          <p className={`text-4xl font-bold ${progress > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {progress > 0 ? '+' : ''}{progress.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Diferencia entre el estado final y el inicial.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
