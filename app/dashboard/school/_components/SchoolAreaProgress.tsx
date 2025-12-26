'use client'

import { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { BarChart, BarChartDataType } from '@/src/components/ui/charts/BarChart';
import { ChartOptions } from 'chart.js';
import { StudentExportDataType } from '../_lib/school.data';

interface SchoolAreaProgressProps {
  data: BarChartDataType;
  studentData: StudentExportDataType[];
}

const avg = (arr: number[]) => (arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);

export default function SchoolAreaProgress({ data: initialChartData, studentData }: SchoolAreaProgressProps) {
  const [selectedArea, setSelectedArea] = useState<string>('all');
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
  
  // Reset grado if it's no longer available in the new list of grados
  if (selectedGrado !== 'all' && !grados.includes(selectedGrado)) {
    setSelectedGrado('all');
  }

  const chartData = useMemo(() => {
    if (selectedSede === 'all' && selectedGrado === 'all') {
      return initialChartData;
    }

    const filteredStudents = studentData.filter(student => {
      const sedeMatch = selectedSede === 'all' || student.sede === selectedSede;
      const gradoMatch = selectedGrado === 'all' || student.degree === selectedGrado;
      return sedeMatch && gradoMatch;
    });

    if (filteredStudents.length === 0) {
      return { labels: [], datasets: [{ label: '', data: [], backgroundColor: [] }] };
    }

    const areaMetrics = new Map<string, { first: number[], average: number[], last: number[] }>();

    for (const student of filteredStudents) {
      for (const area of student.areaAverages) {
        if (!areaMetrics.has(area.name)) {
          areaMetrics.set(area.name, { first: [], average: [], last: [] });
        }
        const metric = areaMetrics.get(area.name)!;
        metric.first.push(area.first);
        metric.average.push(area.average);
        metric.last.push(area.last);
      }
    }
    
    const areaNames = initialChartData.labels;
    const areaAverages = areaNames.map(name => {
      const metric = areaMetrics.get(name) || { first: [], average: [], last: [] };
      return {
        name: name,
        first: avg(metric.first),
        average: avg(metric.average),
        last: avg(metric.last),
      };
    });

    return {
      labels: areaNames,
      datasets: [
        {
          label: 'Primer Resultado',
          data: areaAverages.map(a => a.first),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Promedio',
          data: areaAverages.map(a => a.average),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Último Resultado',
          data: areaAverages.map(a => a.last),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };

  }, [studentData, selectedSede, selectedGrado, initialChartData]);
  
  const customOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        align: 'end',
        anchor: 'end',
        formatter: (value: number) => Math.round(value).toString(),
        font: { weight: 'bold' },
        color: 'black',
      },
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) label += Math.round(context.parsed.y);
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
          callback: (value: string | number) => Math.round(Number(value)).toString(),
        },
        min: 0,
        max: 100,
      },
    },
  };

  let displayChartData = chartData;
  if (chartData && selectedArea !== 'all') {
    const areaIndex = chartData.labels.indexOf(selectedArea);
    if (areaIndex !== -1) {
      displayChartData = {
        labels: ['Primer Simulacro', 'Promedio', 'Último Simulacro'],
        datasets: [
          {
            label: `Rendimiento en ${selectedArea}`,
            data: [
              chartData.datasets[0].data[areaIndex],
              chartData.datasets[1].data[areaIndex],
              chartData.datasets[2].data[areaIndex],
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
          <Select onValueChange={setSelectedArea} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Seleccionar área para ver detalle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas (visión general)</SelectItem>
              {initialChartData?.labels.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[500px]">
        {displayChartData && displayChartData.datasets[0]?.data.length > 0 ? (
          <BarChart data={displayChartData} options={customOptions} />
        ) : (
          <div className="flex items-center justify-center h-full"><p>No hay datos para mostrar con los filtros seleccionados.</p></div>
        )}
      </CardContent>
    </Card>
  );
}
