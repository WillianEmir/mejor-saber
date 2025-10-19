'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import GeneralProgress from "./GeneralProgress"
import AreaProgress from "./AreaProgress"
import CompetenciaProgress from "./CompetenciaProgress"
import EvidenciaProgress from "./EvidenciaProgress"

interface MiProgresoProps {
  generalProgressData: any;
  areaProgressData: any;
  competenciaProgress: any;
  areaAverages: any;
  evidenciaProgress: any;
}

export default function MiProgreso({ 
  generalProgressData, 
  areaProgressData, 
  competenciaProgress, 
  areaAverages,
  evidenciaProgress 
}: MiProgresoProps) {
  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="general">Progreso General</TabsTrigger>
        <TabsTrigger value="areas">Rendimiento por Áreas</TabsTrigger>
        <TabsTrigger value="competencias">Rendimiento por Competencias</TabsTrigger>
        <TabsTrigger value="evidencias">Rendimiento por Evidencias</TabsTrigger>
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
    </Tabs>
  )
}