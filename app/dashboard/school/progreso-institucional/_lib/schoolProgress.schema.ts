export interface areaAveragesType {
  name: string;
  average: number;
} 

export interface CompetenciaProgressType {
  name: string;
  areaName: string;
  first: number;
  average: number;
  last: number;
}

export interface EvidenciaProgressType {
  name: string;
  areaName: string;
  competenciaName: string;
  average: number;
}