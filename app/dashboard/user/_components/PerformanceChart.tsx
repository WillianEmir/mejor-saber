'use client';

import { BarChart, BarChartDataType } from "@/src/components/ui/charts/BarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ChartOptions } from "chart.js"; 

interface PerformanceChartProps {
  areaAverages: { name: string; average: number }[];
  bestAreaName?: string | null;
  worstAreaName?: string | null;
}

const generateChartColors = (labels: string[], bestLabel?: string | null, worstLabel?: string | null) => {
  const defaultColor = "rgba(54, 162, 235, 0.5)";
  const bestColor = "rgba(75, 192, 192, 0.7)";
  const worstColor = "rgba(255, 159, 64, 0.7)";

  return labels.map(label => {
    if (label === bestLabel) return bestColor;
    if (label === worstLabel) return worstColor;
    return defaultColor;
  });
};

export const PerformanceChart = ({ areaAverages, bestAreaName, worstAreaName }: PerformanceChartProps) => {
  const labels = areaAverages.map(item => item.name);
  const dataPoints = areaAverages.map(item => item.average);
  
  const backgroundColors = generateChartColors(labels, bestAreaName, worstAreaName);

  const data: BarChartDataType = {
    labels,
    datasets: [
      {
        label: 'Promedio de Puntaje',
        data: dataPoints,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map(color => color.replace('0.5', '1').replace('0.7', '1')),
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 30,

      },
    ],
  };

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
          stepSize: 20,
          callback: function (value: string | number) {
            return Math.round(Number(value)).toString();
          },
        },
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Rendimiento por Área</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] w-full pb-4">
        <BarChart data={data} options={customOptions} />
      </CardContent>
    </Card>
  );
};
