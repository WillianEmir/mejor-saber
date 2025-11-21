'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { BarChart } from '@/src/components/ui/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { areaAveragesType, CompetenciaProgressType } from '../_lib/progress.schema';

interface CompetenciaProgressProps {
  competenciaProgress: CompetenciaProgressType[];
  areaAverages: areaAveragesType[];
} 

export default function CompetenciaProgress({ competenciaProgress, areaAverages }: CompetenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCompetencia, setSelectedCompetencia] = useState<CompetenciaProgressType | undefined>(undefined);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    setSelectedCompetencia(undefined); // Reset competencia when area changes
  };

  const handleCompetenciaChange = (competenciaName: string) => {
    const competencia = competenciaProgress.find(c => c.name === competenciaName);
    setSelectedCompetencia(competencia);
  };

  const filteredCompetencias = selectedArea
    ? competenciaProgress.filter(c => c.areaName === selectedArea)
    : [];

  const chartData = selectedCompetencia ? {
    labels: ['Primer Simulacro', 'Promedio', 'Último Simulacro'],
    datasets: [
      {
        label: `Rendimiento en ${selectedCompetencia.name}`,
        data: [selectedCompetencia.first, selectedCompetencia.average, selectedCompetencia.last],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
        ],
      },
    ],
  } : {
    labels: [],
    datasets: [],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rendimiento por Competencia</CardTitle>
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={handleAreaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar área" />
            </SelectTrigger>
            <SelectContent>
              {areaAverages.map(area => (
                <SelectItem key={area.name} value={area.name}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleCompetenciaChange} disabled={!selectedArea} value={selectedCompetencia?.name || ''}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar competencia" />
            </SelectTrigger>
            <SelectContent>
              {filteredCompetencias.map(c => (
                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {selectedCompetencia ? (
          <BarChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Selecciona un área y una competencia para ver tu rendimiento.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
