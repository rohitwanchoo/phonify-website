<!-- src/components/ui/chart-area.vue -->
<script setup lang="ts">
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'

const props = defineProps<{
  data: { name: string, [key: string]: number }[]
  index: string
  categories: string[]
}>()

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler)

const labels = props.data.map(item => item[props.index])

const datasets = props.categories.map(cat => ({
  label: cat,
  data: props.data.map(item => item[cat]),
  borderColor: '#1D3E51',
  backgroundColor: '#10b98140',
  fill: true,
  tension: 0.4,
  pointRadius: 0,
}))

const chartData = {
  labels,
  datasets,
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      min: 100000,
      max: 250000,
      ticks: {
        stepSize: 50000,
        callback: (value: number) => `${value / 1000}k`,
        color: '#94a3b8',
      },
      grid: {
        color: '#cbd5e1',
        borderDash: [6, 6],
        drawTicks: false,
      },
    },
    x: {
      ticks: { color: '#94a3b8' },
      grid: {
        display: false,
        drawTicks: false,
      },
    },
  },
}
</script>

<template>
  <div class="h-72 w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
