'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart'
import { ChartOptions } from 'chart.js'; // Added import

interface GeneralProgressProps {
  chartData: BarChartDataType;
}

export default function GeneralProgress({ chartData }: GeneralProgressProps) {

  // Guard Clause: Check if data is available
  if (
    !chartData ||
    !chartData.datasets ||
    !chartData.datasets[0] ||
    !chartData.datasets[0].data ||
    chartData.datasets[0].data.length < 3
  ) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Progreso General</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <p className="text-gray-500">No hay datos disponibles para mostrar el progreso.</p>
        </CardContent>
      </Card>
    );
  }

  const initialScore = chartData.datasets[0].data[0];
  const finalScore = chartData.datasets[0].data[2];
  const progress = finalScore - initialScore;

  const customOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Puntaje Global ICFES (0-500)',
        font: {
          size: 16
        }
      },
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
        display: false
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
          stepSize: 100,
          callback: function (value: string | number) {
            return Math.round(Number(value)).toString();
          },
        }, 
        min: 0,
        max: 500,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Progreso General</CardTitle>
      </CardHeader>
      <CardContent className="md:grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 h-96">
          <BarChart data={chartData} options={customOptions} />
        </div>
        <div className="md:col-span-1 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-2">Progreso Neto</h3>
          <p className={`text-4xl font-bold ${progress > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {progress > 0 ? '+' : ''}{progress}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Diferencia entre el estado final y el inicial.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
