'use client';

import { StatCard } from "./StatCard"; 
import { HighlightCard } from "./HighlightCard";
import { PerformanceChart } from "./PerformanceChart";
import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { BookOpen, BrainCircuit, Timer, TrendingDown, TrendingUp } from "lucide-react";
import { SummaryData } from "./dashboard.schema";

interface DashboardTabContentProps {
  summaryData: SummaryData;
}

const DashboardTabContent = ({ summaryData }: DashboardTabContentProps) => {

  if (summaryData.simulationsTaken === 0) {
    return (
      <Alert className="m-4 md:m-8">
        <BookOpen className="h-4 w-4" />
        <AlertTitle>¡Es hora de empezar!</AlertTitle>
        <AlertDescription>
          Aún no has completado ningún simulacro. ¡Realiza el primero para que podamos empezar a analizar tu progreso y ayudarte a alcanzar tu máximo potencial!
        </AlertDescription>
      </Alert>
    );
  }

  const {
    userName,
    simulationsTaken,
    generalAverage,
    averageTimePerQuestion,
    bestPerformingArea,
    worstPerformingArea,
    areaAverages,
  } = summaryData;

  const formattedTime = `${Math.floor(averageTimePerQuestion / 60)}m ${Math.round(averageTimePerQuestion % 60)}s`;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <h1 className="text-3xl font-bold tracking-tight">
        ¡Hola de nuevo, {userName}!
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Promedio General"
          value={`${generalAverage}`}
          icon={<BrainCircuit className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Simulacros Realizados"
          value={simulationsTaken}
          icon={<BookOpen className="h-5 w-5 text-muted-foreground" />}
        />
        <StatCard
          title="Tiempo Promedio / Pregunta"
          value={formattedTime}
          icon={<Timer className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
           <PerformanceChart 
            areaAverages={areaAverages} 
            bestAreaName={bestPerformingArea?.name}
            worstAreaName={worstPerformingArea?.name}
          />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {bestPerformingArea && (
            <HighlightCard
              variant="success"
              areaName={bestPerformingArea.name}
              average={bestPerformingArea.average}
              icon={<TrendingUp className="h-6 w-6 text-green-700 dark:text-green-400" />}
            />
          )}
          {worstPerformingArea && bestPerformingArea?.name !== worstPerformingArea?.name && (
            <HighlightCard
              variant="warning"
              areaName={worstPerformingArea.name}
              average={worstPerformingArea.average}
              icon={<TrendingDown className="h-6 w-6 text-amber-700 dark:text-amber-400" />}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTabContent;
