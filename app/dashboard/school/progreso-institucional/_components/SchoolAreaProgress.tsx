'use client' 

import { useState } from 'react'; 

import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

interface SchoolAreaProgressProps {
  chartData: BarChartDataType | undefined;
}

export default function SchoolAreaProgress({ chartData: initialChartData }: SchoolAreaProgressProps) {

  if (!initialChartData) return (
    <div className="flex items-center justify-center h-full">
      <p>No hay datos para mostrar.</p>
    </div>
  )
  
  const [selectedAreaName, setSelectedAreaName] = useState('all');

  const handleAreaChange = (areaName: string) => {
    setSelectedAreaName(areaName);
  };

  const areaNames = initialChartData.labels;

  let chartData;
  
  if (selectedAreaName === 'all') {
    chartData = initialChartData;
  } else {
    const areaIndex = initialChartData.labels.indexOf(selectedAreaName);
    if (areaIndex !== -1) {
      chartData = {
        labels: ['Primer Simulacro', 'Promedio', 'Último Simulacro'],
        datasets: [
          {
            label: `Rendimiento en ${selectedAreaName}`,
            data: [
              initialChartData.datasets[0].data[areaIndex], // First
              initialChartData.datasets[1].data[areaIndex], // Average
              initialChartData.datasets[2].data[areaIndex], // Last
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          },
        ],
      };
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="pt-4">
          <Select onValueChange={handleAreaChange} defaultValue="all">
            <SelectTrigger className="w-full mx-auto">
              <SelectValue placeholder="Seleccionar área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {areaNames.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[500px]">
        {chartData ? (
          <BarChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No hay datos para mostrar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
