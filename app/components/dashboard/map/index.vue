<script setup lang="ts">
import * as echarts from 'echarts/core'
import { Separator } from '@/components/ui/separator'
import usaJson from '~/assets/map/USA.json'


interface ApiDataItem {
  state_code: string;
  rowCount: number;
}

const props = defineProps<{
  apiData?: ApiDataItem[];
}>();

const states =
  [
    { name: 'Alabama', value: 0, state_code: 'AL' },
    { name: 'Alaska', value: 0, state_code: 'AK' },
    { name: 'Arizona', value: 0, state_code: 'AZ' },
    { name: 'Arkansas', value: 0, state_code: 'AR' },
    { name: 'California', value: 0, state_code: 'CA' },
    { name: 'Colorado', value: 0, state_code: 'CO' },
    { name: 'Connecticut', value: 0, state_code: 'CT' },
    { name: 'Delaware', value: 0, state_code: 'DE' },
    { name: 'District of Columbia', value: 0, state_code: 'DC' },
    { name: 'Florida', value: 0, state_code: 'FL' },
    { name: 'Georgia', value: 0, state_code: 'GA' },
    { name: 'Hawaii', value: 0, state_code: 'HI' },
    { name: 'Idaho', value: 0, state_code: 'ID' },
    { name: 'Illinois', value: 0, state_code: 'IL' },
    { name: 'Indiana', value: 0, state_code: 'IN' },
    { name: 'Iowa', value: 0, state_code: 'IA' },
    { name: 'Kansas', value: 0, state_code: 'KS' },
    { name: 'Kentucky', value: 0, state_code: 'KY' },
    { name: 'Louisiana', value: 0, state_code: 'LA' },
    { name: 'Maine', value: 0, state_code: 'ME' },
    { name: 'Maryland', value: 0, state_code: 'MD' },
    { name: 'Massachusetts', value: 0, state_code: 'MA' },
    { name: 'Michigan', value: 0, state_code: 'MI' },
    { name: 'Minnesota', value: 0, state_code: 'MN' },
    { name: 'Mississippi', value: 0, state_code: 'MS' },
    { name: 'Missouri', value: 0, state_code: 'MO' },
    { name: 'Montana', value: 0, state_code: 'MT' },
    { name: 'Nebraska', value: 0, state_code: 'NE' },
    { name: 'Nevada', value: 0, state_code: 'NV' },
    { name: 'New Hampshire', value: 0, state_code: 'NH' },
    { name: 'New Jersey', value: 0, state_code: 'NJ' },
    { name: 'New Mexico', value: 0, state_code: 'NM' },
    { name: 'New York', value: 0, state_code: 'NY' },
    { name: 'North Carolina', value: 0, state_code: 'NC' },
    { name: 'North Dakota', value: 0, state_code: 'ND' },
    { name: 'Ohio', value: 0, state_code: 'OH' },
    { name: 'Oklahoma', value: 0, state_code: 'OK' },
    { name: 'Oregon', value: 0, state_code: 'OR' },
    { name: 'Pennsylvania', value: 0, state_code: 'PA' },
    { name: 'Rhode Island', value: 0, state_code: 'RI' },
    { name: 'South Carolina', value: 0, state_code: 'SC' },
    { name: 'South Dakota', value: 0, state_code: 'SD' },
    { name: 'Tennessee', value: 0, state_code: 'TN' },
    { name: 'Texas', value: 0, state_code: 'TX' },
    { name: 'Utah', value: 0, state_code: 'UT' },
    { name: 'Vermont', value: 0, state_code: 'VT' },
    { name: 'Virginia', value: 0, state_code: 'VA' },
    { name: 'Washington', value: 0, state_code: 'WA' },
    { name: 'West Virginia', value: 0, state_code: 'WV' },
    { name: 'Wisconsin', value: 0, state_code: 'WI' },
    { name: 'Wyoming', value: 0, state_code: 'WY' },
    { name: 'Puerto Rico', value: 0, state_code: 'PR' },
  ]

const data = computed(() => {
  const stateCounts: Record<string, number> = {}

  props.apiData?.forEach(({ state_code, rowCount }) => {
    stateCounts[state_code] = (stateCounts[state_code] || 0) + rowCount
  })

  return states.map((item: MapDataItem) => ({
    ...item,
    value: stateCounts[item.state_code] || 0,
  }))
})

// const apIdata
// = [
  
// ]

interface StateData {
  state_code: string
  rowCount: number
}

interface MapDataItem {
  name: string
  value: number
  state_code: string
}


echarts.registerMap('USA', usaJson as any, {
  'Alaska': {
    left: -131,
    top: 25,
    width: 15,
  },
  'Hawaii': {
    left: -110,
    top: 28,
    width: 5,
  },
  'Puerto Rico': {
    left: -76,
    top: 26,
    width: 2,
  },
})

const minValue = computed(() => Math.min(...data.value.map(d => d.value)))
const maxValue = computed(() => Math.max(...data.value.map(d => d.value)))


const option = computed((): ECOption => ({
  tooltip: {
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
    className: 'echarts-tooltip',
  },
  visualMap: {
    left: 'right',
    min: minValue.value,
    max: maxValue.value,
    inRange: {
      color: [
        '#162D3A',
        '#1D3847',
        '#244354',
        '#2B4E61',
        '#32596E',
        '#39647B',
        '#406F88',
        '#477A95',
        '#4E85A2',
        '#5590AF',
        '#5C9BBC',
      ].reverse(),
    },
    text: ['High', 'Low'],
    calculable: true,
  },
  toolbox: {
    show: false,
    feature: {
      dataView: { readOnly: false },
      restore: {},
      saveAsImage: {},
    },
  },
  series: [
    {
      name: 'Users',
      type: 'map',
      roam: false,
      map: 'USA',
      zoom: 1.3, // Add this line to set default zoom level
      center: [-95, 37], // Add this to center the map on USA
      scaleLimit: {
        min: 1, // minimum zoom level
        max: 5, // maximum zoom level
      },
      emphasis: {
        label: {
          show: true,
        },
      },
      data: data.value,
    },
  ],
}))
</script>

<template>
  <div class="h-full w-full border rounded-lg p-6 overflow-hidden">
    <div>
      State Wise Call Report Map
    </div>
    <Separator class="my-6" />
    
    <VChart :option="option" :key="JSON.stringify(apiData)" class="bg-[url('/images/dashboard/map/bg.png')]" />
  </div>
</template>
