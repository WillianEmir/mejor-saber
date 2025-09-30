
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { SimulacroResultsTable } from "./simulacro-results-table";
import { StudentProgressList } from "./student-progress-list";

interface ReportsDashboardProps {
  simulacroResults: any[]; // Replace 'any' with actual type from your server action
  studentProgress: any[]; // Replace 'any' with actual type from your server action
}

export const ReportsDashboard = ({ simulacroResults, studentProgress }: ReportsDashboardProps) => {
  const [activeTab, setActiveTab] = useState("simulacros");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes de Rendimiento Estudiantil</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="simulacros">Resultados de Simulacros</TabsTrigger>
          <TabsTrigger value="progreso">Progreso de Estudiantes</TabsTrigger>
        </TabsList>
        <TabsContent value="simulacros">
          <SimulacroResultsTable results={simulacroResults} />
        </TabsContent>
        <TabsContent value="progreso">
          <StudentProgressList progress={studentProgress} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
