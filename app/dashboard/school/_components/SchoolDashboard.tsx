'use client';

import { Users, BarChart2, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { ChartOptions } from 'chart.js';

import { SchoolProgressData } from '../_lib/school.schema';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { BarChart } from '@/src/components/ui/charts/BarChart';

interface SchoolDashboardProps {
  data: SchoolProgressData;
}

const StatCard = ({ title, value, icon: Icon, bgColor = 'bg-blue-500' }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  bgColor?: string;
}) => (
  <Card className="shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`text-white p-2 rounded-full ${bgColor}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function SchoolDashboard({ data }: SchoolDashboardProps) {
  const { summaryData, overallProgressData } = data;

  const overallProgressValue =
    (overallProgressData.datasets[0].data[2] ?? 0) -
    (overallProgressData.datasets[0].data[0] ?? 0);

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Promedio Puntaje Global ICFES (0-500) - Avance: ${overallProgressValue.toFixed(1)} pts`,
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value) => value.toFixed(0),
        font: {
          weight: 'bold',
        },
        color: 'black',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 500,
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Estudiantes"
          value={`${summaryData.registeredUsers} / ${summaryData.maxUsers}`}
          icon={Users}
          bgColor="bg-blue-500"
        />
        <StatCard
          title="Simulacros Realizados"
          value={summaryData.simulationsTaken}
          icon={BarChart2}
          bgColor="bg-green-500"
        />
        <StatCard
          title="Tiempo Prom/Pregunta"
          value={`${Math.round(summaryData.averageTimePerQuestion)}s`}
          icon={Clock}
          bgColor="bg-orange-500"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Progreso General de la Escuela</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <BarChart data={overallProgressData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <StatCard
            title="Mejor Área"
            value={summaryData.bestPerformingArea?.name ?? 'N/A'}
            icon={CheckCircle}
            bgColor="bg-teal-500"
          />
          <StatCard
            title="Área a Mejorar"
            value={summaryData.worstPerformingArea?.name ?? 'N/A'}
            icon={AlertCircle}
            bgColor="bg-red-500"
          />
        </div>
      </div>
    </div>
  );
}