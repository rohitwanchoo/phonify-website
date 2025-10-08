<script setup lang="ts">
import { useDraggable, useWindowSize } from '@vueuse/core'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
  data?: ShortcutData
}>()

const emits = defineEmits(['openDialer'])

const { isRegistered } = useSIPml5()

interface ShortcutData {
  height?: number
  containerWidth?: number
}

const el = useTemplateRef<HTMLElement>('el')

const { x, y, style, isDragging } = useDraggable(el, {
  initialValue: { x: 40, y: 400 },
  axis: 'y',
  onEnd(position: any) {
    if (position.y < 67) {
      y.value = 67
    }
    if (props?.data?.height && position.y > props.data.height - 100) {
      y.value = props?.data?.height - 124
    }
    //  for x axis
    // if (position.x - 288 <= middleWidth.value) {
    //   x.value = 288
    // }
    // if (position.x - 288 >= middleWidth.value) {
    //   x.value = useWindowSize().width.value - 75
    // }
  },
})

const shortCuts = computed(() => [
  {
    name: 'Chat',
    status: true,
    icon: 'material-symbols:forum-outline',
  },
  {
    name: 'ChatAI',
    status: true,
    icon: 'material-symbols:mail-outline',
  },
  {
    name: 'Fax',
    status: true,
    icon: 'material-symbols:fax-outline',
  },
  {
    name: 'Webphone',
    status: isRegistered.value,
    icon: 'ic:baseline-phone',
    onClick() {
      if (!isRegistered.value) {
        showToast({
          message: 'Webphone is not registered',
          type: 'error',
        })
        return
      }
      emits('openDialer')
    },
  },
])
onMounted(() => {
  x.value = useWindowSize().width.value - 75
})
</script>

<template>
  <div
    ref="el"
    :style="style"
    :class="isDragging ? 'shadow-[-17px_-11px_100px_5px_rgba(34,_197,_94,_0.5)] transition-shadow duration-300 ease-in-out' : ''"
    class="fixed  bg-[#162D3A30] backdrop-blur-xs rounded-lg p-4 z-50 border w-[60px] flex flex-col justify-center items-center "
  >
    <div class="cursor-move">
      <icon name="lucide:grip-horizontal" size="20" />
    </div>
    <div class="space-y-2">
      <TooltipProvider>
        <Tooltip v-for="item in shortCuts" :key="item.name">
          <TooltipTrigger as-child>
            <div :class="item.status ? 'bg-[#00A086]' : 'bg-[#f19d3e]'" class="bg-[#00A086] mix-blend-normal rounded-full h-[36px] w-[36px] flex items-center justify-center cursor-pointer" @click="item.onClick">
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
