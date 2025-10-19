'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { BarChart } from '@/src/components/ui/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';

interface CompetenciaProgressProps {
  competenciaProgress: any[];
  areaAverages: any[];
} 

export default function CompetenciaProgress({ competenciaProgress, areaAverages }: CompetenciaProgressProps) {
  const [selectedArea, setSelectedArea] = useState('all');

  const filteredCompetencias = selectedArea === 'all' 
    ? competenciaProgress 
    : competenciaProgress.filter(c => c.areaName === selectedArea);

  const chartData = {
    labels: filteredCompetencias.map(c => c.name),
    datasets: [
      {
        label: 'Promedio por Competencia',
        data: filteredCompetencias.map(c => c.average),
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rendimiento por Competencias</CardTitle>
        <div className="pt-4">
          <Select onValueChange={setSelectedArea} defaultValue="all">
            <SelectTrigger className="w-[180px] mx-auto">
              <SelectValue placeholder="Seleccionar área" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {areaAverages.map(area => (
                <SelectItem key={area.name} value={area.name}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        <BarChart data={chartData} />
      </CardContent>
    </Card>
  );
}
