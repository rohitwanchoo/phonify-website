<script lang="ts" setup>
interface AreaChartItem {
  month: string
  users: number
}

const categories: Record<string, BulletLegendItemInterface> = {
  users: { name: 'Users', color: '#1D3E51' },
}

const AreaChartData: AreaChartItem[] = [
  { month: 'January', users: 1000 },
  { month: 'February', users: 100 },
  { month: 'March', users: 2000 },
  { month: 'April', users: 2500 },
  { month: 'May', users: 3000 },
  { month: 'June', users: 4500 },
  { month: 'July', users: 5000 },
  { month: 'August', users: 5500 },
  { month: 'September', users: 6000 },
  { month: 'October', users: 6500 },
  { month: 'November', users: 7000 },
  { month: 'December', users: 7500 },
]

const xFormatter = (i: number): string | number => {
  const month = AreaChartData[i]?.month
  return month?.substring(0, 3) || ''
}
function yFormatter(i: number): string | number {
  if (i >= 1000000) {
    return (i / 1000000).toFixed(1) + 'M'
  } else if (i >= 1000) {
    return (i / 1000).toFixed(1) + 'k'
  }
  return i
}
</script>
<template>
  <AreaChart 
  class="h-full"
    :data="AreaChartData"
    :height="275"
    :categories="categories"
    :y-num-ticks="6"
    :x-num-ticks="12"
    :grid-line-y="true"
    :legend-poisition="'top'"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    hideLegend
  />
</template>

