<script setup lang="ts">
const props = defineProps<{
  item: { id: number, title: string }
  index: number
  items: { id: number, title: string }[]
}>()

const emit = defineEmits<{
  reorder: [fromIndex: number, toIndex: number]
}>()

const el = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const startX = ref(0)
const currentX = ref(0)

const dragStyle = computed(() => {
  if (!isDragging.value) {
    return {
      transform: 'translate(0px, 0px)',
      transition: 'transform 0.2s ease',
      zIndex: '1',
    }
  }

  return {
    transform: `translate(${currentX.value - startX.value}px, ${currentY.value - startY.value}px)`,
    transition: 'none',
    zIndex: '50',
    opacity: '0.9',
  }
})

function handleMouseDown(e: MouseEvent) {
  if (!el.value)
    return

  isDragging.value = true
  startY.value = e.clientY
  startX.value = e.clientX
  currentY.value = e.clientY
  currentX.value = e.clientX

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = 'none'
  document.body.style.cursor = 'grabbing'
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value)
    return

  currentY.value = e.clientY
  currentX.value = e.clientX
}

function handleMouseUp() {
  if (!isDragging.value || !el.value)
    return

  const deltaY = currentY.value - startY.value
  const itemHeight = el.value.offsetHeight + 8 // including gap
  const steps = Math.round(deltaY / itemHeight)
  const newIndex = Math.max(0, Math.min(props.items.length - 1, props.index + steps))

  if (newIndex !== props.index) {
    emit('reorder', props.index, newIndex)
  }

  // Reset
  isDragging.value = false
  startY.value = 0
  currentY.value = 0
  startX.value = 0
  currentX.value = 0

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = ''
  document.body.style.cursor = ''
}

// Touch events for mobile
function handleTouchStart(e: TouchEvent) {
  if (!el.value)
    return

  const touch = e.touches[0]
  isDragging.value = true
  startY.value = touch.clientY
  startX.value = touch.clientX
  currentY.value = touch.clientY
  currentX.value = touch.clientX
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value)
    return

  e.preventDefault()
  const touch = e.touches[0]
  currentY.value = touch.clientY
  currentX.value = touch.clientX
}

function handleTouchEnd() {
  if (!isDragging.value || !el.value)
    return

  const deltaY = currentY.value - startY.value
  const itemHeight = el.value.offsetHeight + 8
  const steps = Math.round(deltaY / itemHeight)
  const newIndex = Math.max(0, Math.min(props.items.length - 1, props.index + steps))

  if (newIndex !== props.index) {
    emit('reorder', props.index, newIndex)
  }

  // Reset
  isDragging.value = false
  startY.value = 0
  currentY.value = 0
  startX.value = 0
  currentX.value = 0
}
</script>

<template>
  <div
    ref="el"
    :style="dragStyle"
    class="flex items-center h-[50px] rounded-md transition-colors cursor-grab select-none border border-white/10"
    :class="[
      isDragging
        ? 'bg-slate-600/90 shadow-lg'
        : 'bg-slate-700/50 hover:bg-slate-600/50',
    ]"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="flex items-center justify-center h-full rounded-l-md border border-white/10 w-12 bg-white/5 text-white text-sm font-medium">
      {{ index + 1 }}
    </div>
    <div class="flex-1 text-white text-sm font-medium p-3">
      {{ item.title }}
    </div>
    <div class="pr-1 flex items-center justify-center">
        <Icon name="material-symbols:drag-indicator" size="20" class="text-white font-light" />
    </div>
  </div>
</template>
