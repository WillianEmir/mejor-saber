'use client'

import { useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BarChart } from '@/src/components/ui/charts/BarChart';

type NivelCount = {
  nivel: string;
  count: number;
};

type Niveles = {
  first: NivelCount[];
  last: NivelCount[];
};

type NivelesDesempenoDataItem = {
  areaName: string;
  niveles: Niveles;
};

type nivelesDesempenoDataType = NivelesDesempenoDataItem[];

interface SchoolNivelDesempenoProgressProps {
  nivelesDesempenoData: nivelesDesempenoDataType;
  areaAverages: { name: string; average: number }[];
}

export default function SchoolNivelDesempenoProgress({ nivelesDesempenoData, areaAverages }: SchoolNivelDesempenoProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaChange = (areaName: string) => {
    setSelectedArea(areaName);
  };

  const getChartDataForArea = () => {
    if (!selectedArea) return null;

    const areaData = nivelesDesempenoData.find(a => a.areaName === selectedArea);
    if (!areaData) return null;

    const chartData = {
      labels: areaData.niveles.first.map(n => n.nivel),
      datasets: [
        {
          label: 'Primer Simulacro',
          data: areaData.niveles.first.map(n => n.count),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Último Simulacro',
          data: areaData.niveles.last.map(n => n.count),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    };

    return <BarChart data={chartData} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nivel de Desempeño por Área</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleAreaChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un área para ver el nivel de desempeño de la escuela" />
          </SelectTrigger>
          <SelectContent>
            {areaAverages.map(area => (
              <SelectItem key={area.name} value={area.name}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="h-96 mt-4">
          {getChartDataForArea()}
        </div>
      </CardContent>
    </Card>
  );
}
