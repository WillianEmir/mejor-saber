'use client'

import { useState, useMemo } from 'react';

import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { BarChartDataType } from '@/src/components/ui/charts/BarChart';
import { StudentExportDataType } from '../../_lib/school.data';
import ReportFilters from './filters/ReportFilters';
import AreaChart from './charts/AreaChart';
import CompetencyCharts from './charts/CompetencyCharts';
import EvidenceCharts from './charts/EvidenceCharts';
import { CompetenciaProgressType, EvidenciaProgressType } from '@/app/dashboard/user/_lib/progress.schema';
import { SchoolProgressData } from '../../_lib/school.schema';
import { SummaryCard } from './cards/SummaryCard';
import { Target, BookCheck } from 'lucide-react';

// Definiciones de tipos para los gráficos de competencias y evidencias
export interface CompetencyBarChartDataType {
  area: string;
  chartData: BarChartDataType;
}

export interface EvidenceBarChartDataType {
  area: string;
  competencia: string;
  chartData: BarChartDataType;
}

// Función auxiliar para calcular el promedio
const avg = (arr: number[]): number => (arr.length > 0 ? arr.reduce((acc, v) => acc + v, 0) / arr.length : 0);

// Función para procesar studentExportData y generar el BarChartDataType para el progreso general y por área
interface ProcessedChartData {
  overallProgressData: BarChartDataType;
  areaProgressData: BarChartDataType;
  areaNames: string[];
  competencyChartDataRaw: CompetenciaProgressType[];
  evidenceChartDataRaw: EvidenciaProgressType[];
}

const processStudentDataForCharts = (
  filteredStudentData: StudentExportDataType[],
): ProcessedChartData => {
  if (filteredStudentData.length === 0) {
    const emptyChartData: BarChartDataType = {
      labels: [],
      datasets: [
        {
          label: 'Sin datos',
          data: [],
          backgroundColor: [],
        },
      ],
    };
    return {
      overallProgressData: {
        labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
        datasets: [
          {
            label: 'Puntaje Global ICFES (0-500)',
            data: [0, 0, 0],
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(75, 192, 192, 0.5)',
            ],
          },
        ],
      },
      areaProgressData: emptyChartData,
      areaNames: [],
      competencyChartDataRaw: [],
      evidenceChartDataRaw: [],
    };
  }

  const schoolAggregatedMetrics = {
    initialScores: [] as number[],
    finalScores: [] as number[],
    averageScores: [] as number[],
    areaAverages: new Map<
      string,
      { first: number[]; average: number[]; last: number[] }
    >(),
  };

  const schoolCompetencyMetrics = new Map<
    string,
    {
      name: string;
      areaName: string;
      firstScores: number[];
      lastScores: number[];
      allScores: number[];
    }
  >();

  const schoolEvidenciaMetrics = new Map<
    string,
    {
      name: string;
      competenciaName: string;
      areaName: string;
      firstScores: number[];
      lastScores: number[];
      allScores: number[];
    }
  >();

  const allAreaNames = new Set<string>();

  for (const student of filteredStudentData) {
    schoolAggregatedMetrics.initialScores.push(student.initialOverallScore);
    schoolAggregatedMetrics.finalScores.push(student.finalOverallScore);
    schoolAggregatedMetrics.averageScores.push(student.generalAverage);

    for (const area of student.areaAverages) {
      allAreaNames.add(area.name);
      if (!schoolAggregatedMetrics.areaAverages.has(area.name)) {
        schoolAggregatedMetrics.areaAverages.set(area.name, {
          first: [],
          average: [],
          last: [],
        });
      }
      const schoolArea = schoolAggregatedMetrics.areaAverages.get(area.name)!;
      schoolArea.first.push(area.first);
      schoolArea.average.push(area.average);
      schoolArea.last.push(area.last);
    }

    for (const competencia of student.competenciaAverages) {
      if (!schoolCompetencyMetrics.has(competencia.name)) {
        schoolCompetencyMetrics.set(competencia.name, {
          name: competencia.name,
          areaName: competencia.areaName,
          firstScores: [],
          lastScores: [],
          allScores: [],
        });
      }
      const metric = schoolCompetencyMetrics.get(competencia.name)!;
      metric.firstScores.push(competencia.first);
      metric.lastScores.push(competencia.last);
      metric.allScores.push(competencia.average);
    }

    for (const evidencia of student.evidenciaAverages) {
      if (!schoolEvidenciaMetrics.has(evidencia.name)) {
        schoolEvidenciaMetrics.set(evidencia.name, {
          name: evidencia.name,
          competenciaName: evidencia.competenciaName,
          areaName: evidencia.areaName,
          firstScores: [],
          lastScores: [],
          allScores: [],
        });
      }
      const metric = schoolEvidenciaMetrics.get(evidencia.name)!;
      metric.firstScores.push(evidencia.first);
      metric.lastScores.push(evidencia.last);
      metric.allScores.push(evidencia.average);
    }
  }

  const estadoInicial = avg(schoolAggregatedMetrics.initialScores);
  const estadoFinal = avg(schoolAggregatedMetrics.finalScores);
  const promedioGeneralIcfes = avg(schoolAggregatedMetrics.averageScores);

  const overallProgressData: BarChartDataType = {
    labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
    datasets: [
      {
        label: 'Puntaje Global ICFES (0-500)',
        borderWidth: 1,
        borderRadius: 5,
        data: [estadoInicial, promedioGeneralIcfes, estadoFinal],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
      },
    ],
  };

  const areaNames = Array.from(allAreaNames).sort();
  const areaAverages = areaNames.map(name => {
    const schoolArea = schoolAggregatedMetrics.areaAverages.get(name) ?? {
      first: [],
      average: [],
      last: [],
    };
    return {
      name: name,
      first: avg(schoolArea.first),
      average: avg(schoolArea.average),
      last: avg(schoolArea.last),
    };
  });

  const areaProgressData: BarChartDataType = {
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
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Último Resultado',
        data: areaAverages.map(a => a.last),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const competencyChartDataRaw: CompetenciaProgressType[] = Array.from(
    schoolCompetencyMetrics.values()
  ).map(metric => ({
    name: metric.name,
    areaName: metric.areaName,
    first: avg(metric.firstScores),
    last: avg(metric.lastScores),
    average: avg(metric.allScores),
  }));

  const evidenceChartDataRaw: EvidenciaProgressType[] = Array.from(
    schoolEvidenciaMetrics.values()
  ).map(metric => ({
    name: metric.name,
    competenciaName: metric.competenciaName,
    areaName: metric.areaName,
    first: avg(metric.firstScores),
    last: avg(metric.lastScores),
    average: avg(metric.allScores),
  }));

  return {
    overallProgressData,
    areaProgressData,
    areaNames,
    competencyChartDataRaw,
    evidenceChartDataRaw,
  };
};

interface ReportsGraphProps {
  initialProgressData: SchoolProgressData;
  schoolId: string;
  sedes: {
    id: string;
    nombre: string;
  }[]
}

export default function ReportsGraph({ initialProgressData, schoolId, sedes }: ReportsGraphProps) {

  const [selectedSede, setSelectedSede] = useState('all');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedAreaName, setSelectedAreaName] = useState('all');

  const handleSedeChange = (sedeId: string) => {
    setSelectedSede(sedeId);
    setSelectedDegree('all');
    setSelectedStudent('all');
  };

  const handleDegreeChange = (degree: string) => {
    setSelectedDegree(degree);
    setSelectedStudent('all');
  };

  const handleAreaChange = (areaName: string) => {
    setSelectedAreaName(areaName);
  };

  const filteredStudentExportData = useMemo(() => {
    let filteredData = initialProgressData.studentExportData;

    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        filteredData = filteredData.filter(student => student.sede === sedeName);
      } else {
        filteredData = [];
      }
    }
    if (selectedDegree !== 'all') {
      filteredData = filteredData.filter(student => student.degree === selectedDegree);
    }
    if (selectedStudent !== 'all') {
      filteredData = filteredData.filter(student => student.id === selectedStudent);
    }
    return filteredData;
  }, [initialProgressData.studentExportData, selectedSede, selectedDegree, selectedStudent, sedes]);

  const { overallProgressData, areaProgressData, areaNames, competencyChartDataRaw, evidenceChartDataRaw } = useMemo(() => {
    return processStudentDataForCharts(filteredStudentExportData);
  }, [filteredStudentExportData]);

  const degrees = useMemo(() => {
    let relevantStudents = initialProgressData.studentExportData;
    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        relevantStudents = relevantStudents.filter(student => student.sede === sedeName);
      } else {
        relevantStudents = [];
      }
    }
    const allDegrees = relevantStudents.map(s => s.degree).filter(Boolean);
    const uniqueDegrees = [...new Set(allDegrees)].sort();
    return uniqueDegrees;
  }, [initialProgressData.studentExportData, selectedSede, sedes]);

  const studentList = useMemo(() => {
    let relevantStudents = initialProgressData.studentExportData;

    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        relevantStudents = relevantStudents.filter(student => student.sede === sedeName);
      } else {
        relevantStudents = [];
      }
    }
    if (selectedDegree !== 'all') {
      relevantStudents = relevantStudents.filter(student => student.degree === selectedDegree);
    }

    const students = relevantStudents.map(s => ({
      id: s.id,
      name: s.name,
      lastName: s.lastName,
    }));
    const uniqueStudents = Array.from(new Map(students.map(item => [item['id'], item])).values());
    return uniqueStudents;
  }, [initialProgressData.studentExportData, selectedSede, selectedDegree, sedes]);

  const summaryData = useMemo(() => {
    if (filteredStudentExportData.length === 0) {
      return {
        puntajeIcfesGlobal: 0,
        simulacrosRealizados: 0,
      };
    }

    const puntajeIcfesGlobal = avg(
      filteredStudentExportData.map(student => student.generalAverage)
    );
    const simulacrosRealizados = filteredStudentExportData.reduce(
      (acc, student) => acc + student.simulationsTaken,
      0
    );

    return {
      puntajeIcfesGlobal: Math.round(puntajeIcfesGlobal),
      simulacrosRealizados,
    };
  }, [filteredStudentExportData]);

  const dynamicTitle = useMemo(() => {
    const schoolName = initialProgressData.summaryData.userName;

    if (selectedStudent !== 'all') {
      const student = studentList.find(s => s.id === selectedStudent);
      const studentName = student ? `${student.name} ${student.lastName}` : 'Estudiante';
      if (selectedAreaName !== 'all') {
        return `Resultados de ${studentName} en el área de ${selectedAreaName}`;
      }
      return `Resultados del estudiante ${studentName}`;
    }

    let title = `Resultados del colegio ${schoolName}`;
    if (selectedSede !== 'all') {
      const sedeName = sedes.find(s => s.id === selectedSede)?.nombre;
      if (sedeName) {
        title += `, en la sede ${sedeName}`;
      }
    }
    if (selectedAreaName !== 'all') {
      title += `, en el área de ${selectedAreaName}`;
    }

    return title;
  }, [selectedSede, selectedStudent, selectedAreaName, studentList, sedes, initialProgressData.summaryData.userName]);

  const competencyChartData: CompetencyBarChartDataType[] = useMemo(() => {
    const areas = [...new Set(competencyChartDataRaw.map(c => c.areaName))];

    return areas.map(area => {
      const areaCompetencies = competencyChartDataRaw.filter(c => c.areaName === area);
      const labels = areaCompetencies.map(c => c.name);
      const firstSimulacroData = areaCompetencies.map(c => c.first ?? 0);
      const lastSimulacroData = areaCompetencies.map(c => c.last ?? 0);
      const averageData = areaCompetencies.map(c => c.average ?? 0);

      return {
        area,
        chartData: {
          labels,
          datasets: [
            {
              label: 'Primer Simulacro',
              data: firstSimulacroData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'Promedio',
              data: averageData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
              label: 'Último Simulacro',
              data: lastSimulacroData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        }
      };
    });
  }, [competencyChartDataRaw]);

  const evidenceChartData: EvidenceBarChartDataType[] = useMemo(() => {
    const competencies = [...new Set(evidenceChartDataRaw.map(e => e.competenciaName))];

    return competencies.map(competencia => {
      const competenciaEvidences = evidenceChartDataRaw.filter(e => e.competenciaName === competencia);
      const labels = competenciaEvidences.map(e => e.name);
      const firstSimulacroData = competenciaEvidences.map(e => e.first ?? 0);
      const lastSimulacroData = competenciaEvidences.map(e => e.last ?? 0);
      const averageData = competenciaEvidences.map(e => e.average ?? 0);
      const area = competenciaEvidences[0]?.areaName ?? '';

      return {
        area,
        competencia,
        chartData: {
          labels,
          datasets: [
            {
              label: 'Primer Simulacro',
              data: firstSimulacroData,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              indexAxis: 'y',
            },
            {
              label: 'Promedio',
              data: averageData,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              indexAxis: 'y',
            },
            {
              label: 'Último Simulacro',
              data: lastSimulacroData,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              indexAxis: 'y',
            },
          ],
        }
      };
    });
  }, [evidenceChartDataRaw]);

  let displayChartData = areaProgressData;

  if (selectedAreaName !== 'all') {
    const areaIndex = areaProgressData!.labels.indexOf(selectedAreaName);
    if (areaIndex !== -1 && areaProgressData) {
      displayChartData = {
        labels: ['Primer Simulacro', 'Promedio', 'Último Simulacro'],
        datasets: [
          {
            label: `Rendimiento en ${selectedAreaName}`,
            data: [
              areaProgressData.datasets[0].data[areaIndex],
              areaProgressData.datasets[1].data[areaIndex],
              areaProgressData.datasets[2].data[areaIndex],
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(54, 162, 235, 0.5)',
            ],
          },
        ],
      };
    }
  }

  const filteredCompetencyChartData = selectedAreaName === 'all'
    ? competencyChartData
    : competencyChartData.filter(d => d.area === selectedAreaName);

  return (
    <>
      <Card className='border-none shadow-none p-0.5'>
        <CardHeader className="sticky top-0 z-10 bg-white dark:bg-gray-950">
          <ReportFilters
            sedes={sedes}
            degrees={degrees}
            studentList={studentList}
            areaNames={areaNames}
            selectedSede={selectedSede}
            selectedDegree={selectedDegree}
            selectedStudent={selectedStudent}
            selectedAreaName={selectedAreaName}
            onSedeChange={handleSedeChange}
            onDegreeChange={handleDegreeChange}
            onStudentChange={setSelectedStudent}
            onAreaChange={handleAreaChange}
          />
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">{dynamicTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SummaryCard
                title="Puntaje Global ICFES"
                value={summaryData.puntajeIcfesGlobal}
                icon={<Target className="h-4 w-4 text-muted-foreground" />}
              />
              <SummaryCard
                title="Simulacros Realizados"
                value={summaryData.simulacrosRealizados}
                icon={<BookCheck className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </div>
          <AreaChart displayChartData={displayChartData} />
        </CardContent>
      </Card>

      <CompetencyCharts filteredCompetencyChartData={filteredCompetencyChartData} />

      <EvidenceCharts evidenceChartData={evidenceChartData} selectedAreaName={selectedAreaName} />
    </>
  );
}
