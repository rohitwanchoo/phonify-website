<script lang="ts" setup>
interface AreaChartItem {
  label: string
  in: number
  out: number
}
const props = defineProps<{
  areaChartData: AreaChartItem[]
}>()

const categories: Record<string, BulletLegendItemInterface> = {
  in: { name: 'Inbound', color: '#1D3E51' },
  out: { name: 'Outbound', color: '#dece09' },
}

function xFormatter(i: number): string | number {
  const label = props.areaChartData[i]?.label
  return label?.substring(0, 3) || ''
}
function yFormatter(i: number): string | number {
  if (i >= 1000000) {
    return `${(i / 1000000).toFixed(1)}M`
  }
  else if (i >= 1000) {
    return `${(i / 1000).toFixed(1)}k`
  }
  return i
}
</script>

<template>
  <AreaChart
    class="h-full"
    :data="areaChartData"
    :height="275"
    :categories="categories"
    :y-num-ticks="6"
    :x-num-ticks="12"
    :grid-line-y="true"
    legend-poisition="top"
    :x-formatter="xFormatter"
    :y-formatter="yFormatter"
    hide-legend
  />
</template>
