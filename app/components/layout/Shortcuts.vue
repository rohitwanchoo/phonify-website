<script setup lang="ts">
import { useDraggable, useWindowSize } from '@vueuse/core'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ShortcutData {
  height?: number
  containerWidth?: number
}

const props = defineProps<{
  data?: ShortcutData
}>()

const emits = defineEmits(['openDialer'])
const el = useTemplateRef<HTMLElement>('el')

const { x, y, style } = useDraggable(el, {
  initialValue: { x: 40, y: 400 },
  axis: 'y',
  onEnd(position: any) {
    if (position.y < 67) {
      y.value = 67
    }
    if (props?.data?.height && position.y > props.data.height - 100) {
      y.value = props?.data?.height - 108
    }
  },
})

const shortCuts = [
  {
    name: 'Chat',
    icon: 'material-symbols:forum-outline',

  },

  {
    name: 'ChatAI',
    icon: 'material-symbols:mail-outline',
  },
  {
    name: 'Fax',
    icon: 'material-symbols:fax-outline',
  },
  {
    name: 'Webphone',
    icon: 'ic:baseline-phone',
    onClick() {
      emits('openDialer')
    },
  },

]

onMounted(() => {
  x.value = useWindowSize().width.value - 75
})
</script>

<template>
  <div
    ref="el"
    :style="style"
    class="fixed  bg-[#162D3A30] backdrop-blur-[10] shadow-lg rounded-lg p-4 z-50 border w-[60px] flex flex-col justify-center items-center"
  >
    <div class="cursor-move">
      <icon name="lucide:grip-horizontal" size="20" />
    </div>
    <div class="space-y-2">
      <TooltipProvider>
        <Tooltip v-for="item in shortCuts" :key="item.name">
          <TooltipTrigger as-child>
            <div class="bg-[#00A086] rounded-full h-[36px] w-[36px] flex items-center justify-center cursor-pointer" @click="item.onClick">
              <icon :name="item.icon" class="text-white" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{{ item.name }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>
