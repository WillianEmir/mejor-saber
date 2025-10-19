
'use client'

import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DoughnutChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }[]
  }
  options?: ChartOptions<'doughnut'>
}

export const DoughnutChart = ({ data, options }: DoughnutChartProps) => {
  const defaultOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += context.parsed + '%'
            }
            return label
          },
        },
      },
    },
  }

  return <Doughnut data={data} options={options || defaultOptions} />
}
