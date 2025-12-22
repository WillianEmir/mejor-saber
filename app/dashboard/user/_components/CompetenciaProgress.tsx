'use client'

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'; 
import { BarChart } from '@/src/components/ui/charts/BarChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { areaAveragesType, CompetenciaProgressType } from '../_lib/progress.schema';

interface CompetenciaProgressProps {
  competenciaAverages: CompetenciaProgressType[];
  areaAverages: areaAveragesType[];
}

export default function CompetenciaProgress({ competenciaAverages, areaAverages }: CompetenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedCompetenciaName, setSelectedCompetenciaName] = useState<string | null>(null);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
    setSelectedCompetenciaName(null); // Reset competencia when area changes
  };

  const handleCompetenciaChange = (competenciaName: string) => {
    setSelectedCompetenciaName(competenciaName);
  };

  const filteredCompetencias = useMemo(() => {
    if (!selectedArea) return [];
    return competenciaAverages.filter(c => c.areaName === selectedArea);
  }, [selectedArea, competenciaAverages]);

  const chartData = useMemo(() => {
    if (selectedCompetenciaName) {
      const competencia = competenciaAverages.find(c => c.name === selectedCompetenciaName);
      if (!competencia) return { labels: [], datasets: [] };
      
      return {
        labels: ['Primer Resultado', 'Promedio', 'Último Resultado'],
        datasets: [
          {
            label: `Rendimiento en ${competencia.name}`,
            data: [competencia.first, competencia.average, competencia.last],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          },
        ],
      };
    }

    if (selectedArea) {
      const competenciasInArea = competenciaAverages.filter(c => c.areaName === selectedArea);
      if (competenciasInArea.length === 0) return { labels: [], datasets: [] };
      
      return {
        labels: competenciasInArea.map(c => c.name),
        datasets: [
          {
            label: 'Primer Resultado',
            data: competenciasInArea.map(c => c.first),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Promedio',
            data: competenciasInArea.map(c => c.average),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
          {
            label: 'Último Resultado',
            data: competenciasInArea.map(c => c.last),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
        ],
      };
    }

    return { labels: [], datasets: [] }; // Default empty state
  }, [selectedArea, selectedCompetenciaName, competenciaAverages]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rendimiento por Competencia</CardTitle>
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={handleAreaChange} value={selectedArea || ''}>
            <SelectTrigger>
              <SelectValue placeholder="1. Seleccionar un área" />
            </SelectTrigger>
            <SelectContent>
              {areaAverages.map(area => (
                <SelectItem key={area.name} value={area.name}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleCompetenciaChange} disabled={!selectedArea} value={selectedCompetenciaName || ''}>
            <SelectTrigger>
              <SelectValue placeholder="2. Ver una competencia (Opcional)" />
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
        {selectedArea ? (
          <BarChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Selecciona un área para ver tu rendimiento.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
