'use client'

import { useState, useMemo } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { BarChart } from '@/src/components/ui/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { areaAveragesType, CompetenciaProgressType, EvidenciaProgressType } from '../_lib/progress.schema';

interface EvidenciaProgressProps {
  evidenciaProgress: EvidenciaProgressType[];
  areaAverages: areaAveragesType[];
  competenciaProgress: CompetenciaProgressType[];
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

export default function EvidenciaProgress({ evidenciaProgress, areaAverages, competenciaProgress }: EvidenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCompetencia, setSelectedCompetencia] = useState('');

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    setSelectedCompetencia(''); // Reset competencia on area change
  }

  const availableCompetencias = useMemo(() => {
    if (!selectedArea) return [];
    return competenciaProgress.filter(c => c.areaName === selectedArea);
  }, [selectedArea, competenciaProgress]);

  const filteredEvidencias = useMemo(() => {
    if (!selectedArea || !selectedCompetencia) return []; // Show nothing if no area or no competencia is selected

    return evidenciaProgress.filter(e => {
      const areaMatch = e.areaName === selectedArea;
      const competenciaMatch = e.competenciaName === selectedCompetencia;
      return areaMatch && competenciaMatch;
    });
  }, [selectedArea, selectedCompetencia, evidenciaProgress]);

  const chartData = {
    labels: filteredEvidencias.map(e => {
      const lbl = formatLabel(e.name);
      return Array.isArray(lbl) ? lbl.join('\n') : lbl;
    }),
    datasets: [
      {
        label: 'Primer Resultado',
        data: filteredEvidencias.map(e => e.first),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Promedio',
        data: filteredEvidencias.map(e => e.average),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Último Resultado',
        data: filteredEvidencias.map(e => e.last),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rendimiento por Evidencias',
      },
      datalabels: {
        anchor: 'end' as const,
        align: 'end' as const,
        formatter: (value: number) => value.toFixed(2) + '%',
        color: 'black',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            return value + '%'
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rendimiento por Evidencias</CardTitle>
        <div className="flex justify-center gap-4 pt-4">
          <Select onValueChange={handleAreaChange} value={selectedArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar Área" />
            </SelectTrigger>
            <SelectContent>
              {areaAverages.map(area => (
                <SelectItem key={area.name} value={area.name}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedCompetencia} value={selectedCompetencia} disabled={!selectedArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar Competencia" />
            </SelectTrigger>
            <SelectContent>
              {availableCompetencias.map(comp => (
                <SelectItem key={comp.name} value={comp.name}>{comp.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent style={{height: `${Math.max(384, filteredEvidencias.length * 40)}px`}}>
        {filteredEvidencias.length > 0 ? (
          <BarChart data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Selecciona un área y una competencia para ver el rendimiento de las evidencias.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
