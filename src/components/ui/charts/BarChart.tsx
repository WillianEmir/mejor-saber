'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

export interface BarChartDataType {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
    borderRadius?: number | number[]
    borderSkipped?: 'left' | 'right' | 'top' | 'bottom' | false
    categoryPercentage?: number
    barPercentage?: number
    maxBarThickness?: number
    minBarLength?: number
    offsetGridLines?: boolean
    datalabels?: {
      anchor?: 'start' | 'end' | 'center'
      align?: 'start' | 'end' | 'center'
      offset?: number
    }
    barThickness?: number
    indexAxis?: 'x' | 'y'
  }[]
}

interface BarChartProps {
  data: BarChartDataType
  options?: ChartOptions<'bar'>
}

export const BarChart = ({ data, options }: BarChartProps) => {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'TODO: Agregar variable',
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value) => {
          return value.toFixed(2) + '%';
        },
        font: {
          weight: 'bold',
        },
        color: 'black',
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value + '%'
          },
        },
        min: 0,
        max: 100,
      },
    },
  }

  return <Bar data={data} options={options || defaultOptions} />
}
