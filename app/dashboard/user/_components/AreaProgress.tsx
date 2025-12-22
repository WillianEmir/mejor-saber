'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/src/components/ui/card'
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { ChartOptions } from 'chart.js';

interface AreaProgressProps {
  chartData: BarChartDataType | undefined;
}

export default function AreaProgress({ chartData: initialChartData }: AreaProgressProps) {

  const [selectedAreaName, setSelectedAreaName] = useState('all');

  const customOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (value: number) => {
          return Math.round(value).toString();
        },
        font: {
          weight: 'bold',
        },
        color: 'black',
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += Math.round(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          callback: function (value: string | number) {
            return Math.round(Number(value)).toString();
          },
        },
        min: 0,
        max: 100,
      },
    },
  };

  if (!initialChartData) return (
    <div className="flex items-center justify-center h-full">
      <p>No hay datos para mostrar.</p>
    </div>
  )

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
          <BarChart data={chartData} options={customOptions} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No hay datos para mostrar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
