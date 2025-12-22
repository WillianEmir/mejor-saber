'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs" 
import GeneralProgress from "./GeneralProgress"
import AreaProgress from "./AreaProgress"
import CompetenciaProgress from "./CompetenciaProgress"
import EvidenciaProgress from "./EvidenciaProgress"
import NivelDesempenoProgress from "./NivelDesempenoProgress"
import { NivelDesempeno } from "@/src/generated/prisma"
import { BarChartDataType } from "@/src/components/ui/charts/BarChart"
import { areaAveragesType, CompetenciaProgressType, EvidenciaProgressType } from "../_lib/progress.schema"
import { SummaryData } from "./dashboard.schema"
import DashboardTabContent from "./DashboardTabContent"

interface MiProgresoProps { 
  summaryData: SummaryData;
  generalProgressData: BarChartDataType;
  areaProgressData: BarChartDataType | undefined;
  competenciaAverages: CompetenciaProgressType[];
  areaAveragesData: areaAveragesType[];
  evidenciaProgress: EvidenciaProgressType[];
  nivelesDesempeno: (NivelDesempeno & { area: { nombre: string } })[];
}

export default function MiProgreso({ 
  summaryData,
  generalProgressData,
  areaProgressData,
  competenciaAverages,
  areaAveragesData,
  evidenciaProgress,
  nivelesDesempeno
}: MiProgresoProps) {
  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="areas">Áreas</TabsTrigger>
        <TabsTrigger value="competencias">Competencias</TabsTrigger>
        <TabsTrigger value="evidencias">Evidencias</TabsTrigger>
        <TabsTrigger value="desempeno">Nivel de Desempeño</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <DashboardTabContent summaryData={summaryData} />
      </TabsContent>
      <TabsContent value="general">
        <GeneralProgress chartData={generalProgressData} />
      </TabsContent>
      <TabsContent value="areas">
        <AreaProgress chartData={areaProgressData} />
      </TabsContent>
      <TabsContent value="competencias">
        <CompetenciaProgress 
          competenciaAverages={competenciaAverages} 
          areaAverages={areaAveragesData} 
        />
      </TabsContent>
      <TabsContent value="evidencias">
        <EvidenciaProgress 
          evidenciaProgress={evidenciaProgress} 
          areaAverages={areaAveragesData} 
          competenciaProgress={competenciaAverages} 
        />
      </TabsContent>
      <TabsContent value="desempeno">
        <NivelDesempenoProgress 
          nivelesDesempeno={nivelesDesempeno} 
          areaAverages={areaAveragesData} 
        />
      </TabsContent>
    </Tabs>
  )
}