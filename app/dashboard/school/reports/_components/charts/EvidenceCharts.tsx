'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BarChart } from '@/src/components/ui/charts/BarChart';
import { EvidenceBarChartDataType } from '../../_lib/reports.data';

interface EvidenceChartsProps {
  evidenceChartData: EvidenceBarChartDataType[]; 
  selectedAreaName: string;
}

const formatLabel = (label: string, maxLength = 35): string | string[] => {
  if (label.length <= maxLength) return label;

  const lines: string[] = [];
  let currentLine = '';
  const words = label.split(' ');

  words.forEach(word => {
    const prospectiveLine = currentLine ? `${currentLine} ${word}` : word;
    if (prospectiveLine.length > maxLength) {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    } else {
      currentLine = prospectiveLine;
    }
  });
  lines.push(currentLine);

  return lines;
};


export default function EvidenceCharts({ evidenceChartData, selectedAreaName }: EvidenceChartsProps) {
  const filteredData = selectedAreaName === 'all'
    ? evidenceChartData
    : evidenceChartData.filter(d => d.area === selectedAreaName);

  const groupedByArea = filteredData.reduce((acc, data) => {
    if (!acc[data.area]) {
      acc[data.area] = [];
    }
    acc[data.area].push(data);
    return acc;
  }, {} as Record<string, EvidenceBarChartDataType[]>);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Resultados por Evidencia</h2>
      <div className="space-y-8">
        {Object.entries(groupedByArea).map(([area, competencies]) => (
          <div key={area}>
            <h3 className="text-2xl font-bold tracking-tight mb-4">{area}</h3>
            <div className="grid grid-cols-1 gap-6">
              {competencies.map(data => {
                const chartOptions = {
                  indexAxis: 'y' as const,
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: false, // Title is already in CardHeader
                    },
                    datalabels: {
                      anchor: 'end' as const,
                      align: 'end' as const,
                      formatter: (value: number) => value.toFixed(2),
                      color: 'black',
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                    },
                  },
                };

                const chartDataWithFormattedLabels = {
                  ...data.chartData,
                  labels: data.chartData.labels.map(l => {
                      const lbl = formatLabel(l);
                      return Array.isArray(lbl) ? lbl.join('\n') : lbl;
                  }),
                };

                return (
                  <Card key={data.competencia}>
                    <CardHeader>
                      <CardTitle>{data.competencia}</CardTitle>
                    </CardHeader>
                    <CardContent style={{ height: `${Math.max(400, data.chartData.labels.length * 50)}px` }}>
                      <BarChart data={chartDataWithFormattedLabels} options={chartOptions} />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
