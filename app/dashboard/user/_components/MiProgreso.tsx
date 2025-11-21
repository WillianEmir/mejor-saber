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

interface MiProgresoProps {
  generalProgressData: BarChartDataType;
  areaProgressData: BarChartDataType | undefined;
  competenciaProgress: CompetenciaProgressType[];
  areaAverages: areaAveragesType[];
  evidenciaProgress: EvidenciaProgressType[];
  nivelesDesempeno: (NivelDesempeno & { area: { nombre: string } })[];
}

export default function MiProgreso({ generalProgressData, areaProgressData, competenciaProgress, areaAverages, evidenciaProgress, nivelesDesempeno }: MiProgresoProps) {
  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="areas">Por Áreas</TabsTrigger>
        <TabsTrigger value="competencias">Por Competencias</TabsTrigger>
        <TabsTrigger value="evidencias">Por Evidencias</TabsTrigger>
        <TabsTrigger value="desempeno">Nivel de Desempeño</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralProgress chartData={generalProgressData} />
      </TabsContent>
      <TabsContent value="areas">
        <AreaProgress chartData={areaProgressData} />
      </TabsContent>
      <TabsContent value="competencias">
        <CompetenciaProgress competenciaProgress={competenciaProgress} areaAverages={areaAverages} />
      </TabsContent>
      <TabsContent value="evidencias">
        <EvidenciaProgress 
          evidenciaProgress={evidenciaProgress} 
          areaAverages={areaAverages} 
          competenciaProgress={competenciaProgress} 
        />
      </TabsContent>
      <TabsContent value="desempeno">
        <NivelDesempenoProgress 
          nivelesDesempeno={nivelesDesempeno} 
          areaAverages={areaAverages} 
        />
      </TabsContent>
    </Tabs>
  )
}