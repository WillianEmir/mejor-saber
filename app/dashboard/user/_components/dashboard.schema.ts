export interface SummaryData {
  userName: string;
  simulationsTaken: number;
  generalAverage: number;
  averageTimePerQuestion: number;
  bestPerformingArea: { name: string; average: number } | null;
  worstPerformingArea: { name: string; average: number } | null;
  areaAverages: { name: string; average: number }[];
}
