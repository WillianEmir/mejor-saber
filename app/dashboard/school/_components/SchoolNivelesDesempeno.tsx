'use client'

import { useState, useMemo } from 'react';
import { ChartOptions } from 'chart.js';

import { SchoolProgressData, NivelDesempenoData } from '../_lib/school.schema';
import { StudentExportDataType } from '../_lib/school.data';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion";

interface SchoolNivelDesempenoProgressProps {
  data: SchoolProgressData;
  studentData: StudentExportDataType[];
}

const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);

export default function SchoolNivelDesempenoProgress({ data, studentData }: SchoolNivelDesempenoProgressProps) {
  const [selectedSede, setSelectedSede] = useState<string>('all');
  const [selectedGrado, setSelectedGrado] = useState<string>('all');

  const sedes = useMemo(() => {
    const allSedes = studentData.map(s => s.sede).filter(Boolean);
    return [...new Set(allSedes)];
  }, [studentData]);

  const grados = useMemo(() => {
    const filteredBySede = selectedSede === 'all' ? studentData : studentData.filter(s => s.sede === selectedSede);
    const allGrados = filteredBySede.map(s => s.degree).filter(Boolean);
    return [...new Set(allGrados)].sort();
  }, [studentData, selectedSede]);
  
  if (selectedGrado !== 'all' && !grados.includes(selectedGrado)) {
    setSelectedGrado('all');
  }
  
  const { filteredNivelesData, filteredAreaAverages } = useMemo(() => {
    const filteredStudents = studentData.filter(student => {
      const sedeMatch = selectedSede === 'all' || student.sede === selectedSede;
      const gradoMatch = selectedGrado === 'all' || student.degree === selectedGrado;
      return sedeMatch && gradoMatch;
    });

    if (filteredStudents.length === 0) {
      return { filteredNivelesData: [], filteredAreaAverages: [] };
    }

    const areaMetrics = new Map<string, { averages: number[] }>();
    const nivelesMetrics = new Map<string, Map<string, number>>();

    for (const student of filteredStudents) {
      for (const area of student.areaAverages) {
        // Recalculate area averages
        if (!areaMetrics.has(area.name)) {
          areaMetrics.set(area.name, { averages: [] });
        }
        areaMetrics.get(area.name)!.averages.push(area.average);

        // Recalculate niveles distribution
        const nivelDef = data.nivelesDefiniciones.find(
          n => n.area.nombre === area.name && area.average >= n.puntajeMin && area.average <= n.puntajeMax
        );
        if (nivelDef) {
          if (!nivelesMetrics.has(area.name)) {
            nivelesMetrics.set(area.name, new Map());
          }
          const areaNiveles = nivelesMetrics.get(area.name)!;
          areaNiveles.set(nivelDef.nivel, (areaNiveles.get(nivelDef.nivel) || 0) + 1);
        }
      }
    }
    
    const newAreaAverages = Array.from(areaMetrics.entries()).map(([name, metrics]) => ({
      name,
      average: avg(metrics.averages),
      first: 0, // Not needed for this component
      last: 0,  // Not needed for this component
    }));

    const newNivelesData: NivelDesempenoData[] = Array.from(nivelesMetrics.entries()).map(([areaName, nivelesMap]) => ({
      areaName,
      niveles: Array.from(nivelesMap.entries()).map(([nivel, studentCount]) => ({
        nivel,
        studentCount,
      })),
    }));

    return { filteredNivelesData: newNivelesData, filteredAreaAverages: newAreaAverages };

  }, [studentData, selectedSede, selectedGrado, data.nivelesDefiniciones]);

  const areasWithData = useMemo(() => {
    return filteredNivelesData.map(d => d.areaName);
  }, [filteredNivelesData]);

  const [selectedArea, setSelectedArea] = useState<string | undefined>(areasWithData[0]);
  
  // Reset selectedArea if it's no longer in the list of available areas
  if(selectedArea && !areasWithData.includes(selectedArea)){
    setSelectedArea(areasWithData[0]);
  } else if (!selectedArea && areasWithData.length > 0){
    setSelectedArea(areasWithData[0]);
  }


  const { chartData, chartOptions } = useMemo(() => {
    if (!selectedArea) return { chartData: undefined, chartOptions: undefined };
    
    const areaDistributionData = filteredNivelesData.find(d => d.areaName === selectedArea);
    if (!areaDistributionData) return { chartData: undefined, chartOptions: undefined };

    const areaAverageData = filteredAreaAverages.find(a => a.name === selectedArea);
    const averageScore = areaAverageData ? areaAverageData.average : 0;

    const nivelDef = data.nivelesDefiniciones.find(
      n => n.area.nombre === selectedArea && averageScore >= n.puntajeMin && averageScore <= n.puntajeMax
    );
    const nivelName = nivelDef ? nivelDef.nivel.replace('NIVEL', 'Nivel ') : 'N/A';
    
    const sortedNiveles = [...areaDistributionData.niveles].sort((a, b) => {
      const levelA = parseInt(a.nivel.replace('NIVEL', ''), 10);
      const levelB = parseInt(b.nivel.replace('NIVEL', ''), 10);
      return levelA - levelB;
    });

    const finalChartData: BarChartDataType = {
      labels: sortedNiveles.map(n => n.nivel.replace('NIVEL', 'Nivel ')),
      datasets: [
        {
          label: 'Cantidad de Estudiantes',
          data: sortedNiveles.map(n => n.studentCount),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
        },
      ],
    };

    const finalChartOptions: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          align: 'end',
          anchor: 'end',
          formatter: (value: number) => value.toString(),
          font: { weight: 'bold' },
          color: 'black',
        },
        legend: { display: false },
        title: {
          display: true,
          text: `Distribución en ${selectedArea} (Promedio: ${averageScore.toFixed(0)} - ${nivelName})`,
          font: { size: 16 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Cantidad de Estudiantes',
          }
        },
      },
    };

    return { chartData: finalChartData, chartOptions: finalChartOptions };
  }, [filteredNivelesData, filteredAreaAverages, selectedArea, data.nivelesDefiniciones]);

  const groupedNiveles = useMemo(() => {
    if (!selectedArea) return [];
    const grouped = new Map<string, { nivel: string; descripciones: string[] }>();
    data.nivelesDefiniciones
      .filter(n => n.area.nombre === selectedArea)
      .forEach(nivelDef => {
        const nivelKey = nivelDef.nivel;
        if (!grouped.has(nivelKey)) {
          grouped.set(nivelKey, { nivel: nivelKey, descripciones: [] });
        }
        grouped.get(nivelKey)!.descripciones.push(nivelDef.descripcion);
      });
    return Array.from(grouped.values()).sort((a, b) => 
      parseInt(a.nivel.replace('NIVEL', ''), 10) - parseInt(b.nivel.replace('NIVEL', ''), 10)
    );
  }, [data.nivelesDefiniciones, selectedArea]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setSelectedSede} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Filtrar por Sede" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las sedes</SelectItem>
              {sedes.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedGrado} value={selectedGrado} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Filtrar por Grado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los grados</SelectItem>
              {grados.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
            <Select onValueChange={setSelectedArea} value={selectedArea}>
              <SelectTrigger><SelectValue placeholder="Seleccionar un área" /></SelectTrigger>
              <SelectContent>
                {areasWithData.map((areaName) => (
                  <SelectItem key={areaName} value={areaName}>
                    {areaName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[500px]">
          {chartData ? (
            <BarChart data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No hay datos para mostrar con los filtros seleccionados.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedArea && groupedNiveles.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <h3 className="text-xl font-semibold">Descripciones de Niveles de Desempeño en {selectedArea}</h3>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {groupedNiveles.map((grupo) => (
                <AccordionItem key={grupo.nivel} value={grupo.nivel}>
                  <AccordionTrigger>{grupo.nivel.replace('NIVEL', 'Nivel ')}</AccordionTrigger>
                  <AccordionContent>
                    {grupo.descripciones.map((desc, index) => (
                      <p key={index} className={index > 0 ? 'mt-2' : ''}>{desc}</p>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </>
  );
}