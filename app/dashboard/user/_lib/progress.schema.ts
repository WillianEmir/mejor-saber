import { BarChartDataType } from "@/src/components/ui/charts/BarChart";
import { SimulacroWithRelationsType } from "../simulacros/_lib/simulacro.schema";

export type areaAveragesType = {
  name: string;
  average: number
}

export type ProgressDataType = {
  overallAverage: number
  bestArea: { name: string; average: number } | null
  worstArea: { name: string; average: number } | null
  areaAverages: areaAveragesType[]
  areaProgressData?: BarChartDataType 
  simulacros: SimulacroWithRelationsType[]
}

export type GeneralProgressType = {
  initialScore: number
  overallAverage: number
  finalScore: number
}

export type CompetenciaProgressType = {
  name: string
  areaName: string
  first: number
  last: number
  average: number
}

export type AreaProgressType = {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
  }[]
}

export type EvidenciaProgressType = {
  last: any;
  first: any;
  name: string;
  competenciaName: string;
  areaName: string;
  average: number;
}