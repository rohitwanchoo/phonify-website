<script setup lang="ts">
import { useSortable } from '@vueuse/integrations/useSortable'
import Button from '~/components/ui/button/Button.vue'

// Props
const props = defineProps<{
  labelList: { id: number, title: string, display_order: number }[] | undefined
}>()

const el = useTemplateRef<HTMLElement>('el')

async function handleOrderChange(updatedItems: { id: number, display_order: number }[]) {
  try {
    // Extract just the IDs in the new order
    const displayOrderArray = updatedItems.map(item => item.id)

    const response = await useApi().post('/label/updateDisplayOrder', {
      display_order: displayOrderArray,
    })

    if (response.success === true) {
      showToast({
        message: response.message,
        type: 'success',
      })
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
      type: 'error',
    })
  }
}

// Sort the list by display_order and make it reactive
const sortedList = computed(() => {
  if (!props.labelList)
    return []
  return [...props.labelList].sort((a, b) => a.display_order - b.display_order)
})

// Create a reactive reference for the sortable that updates when props change
const sortableList = ref<{ id: number, title: string, display_order: number }[]>([])

// Track if we're currently updating to prevent watch conflicts
const isUpdating = ref(false)
const isProcessingDrag = ref(false)

// Watch for changes in the sorted list and update sortableList
watch(sortedList, (newList) => {
  if (!isUpdating.value) {
    sortableList.value = [...newList]
  }
}, { immediate: true })

// Refresh function
function refreshOrder() {
  if (sortedList.value.length > 0) {
    isUpdating.value = false
    sortableList.value = [...sortedList.value]

    // The current order - use the actual array positions
    const updatedItems = sortableList.value.map((item, index) => ({
      id: item.id,
      display_order: index + 1,
    }))

    handleOrderChange(updatedItems)
  }
}

// Bind useSortable to the reactive reference
useSortable(el, sortableList, {
  animation: 150,
  ghostClass: 'ghost',
  chosenClass: 'chosen',
  dragClass: 'drag',
  onStart: (evt: any) => {
    // Store the current order before any drag modifications
    evt.from.setAttribute('data-before-drag', JSON.stringify(sortableList.value))
  },
  onEnd: async (evt: any) => {
    // Only if the order actually changed and we're not already processing a drag
    if (evt.oldIndex !== evt.newIndex && !isProcessingDrag.value) {
      isProcessingDrag.value = true
      isUpdating.value = true

      // Get the order before the drag from the stored data
      const beforeDragOrder = JSON.parse(evt.from.getAttribute('data-before-drag') || '[]')

      // Manually reorder the array based on the drag indices
      const item = beforeDragOrder[evt.oldIndex]
      const newOrder = [...beforeDragOrder]
      newOrder.splice(evt.oldIndex, 1)
      newOrder.splice(evt.newIndex, 0, item)

      // Create the updated items array with new display_order values based on the manual reorder
      const updatedItems = newOrder.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }))

      // Update the sortableList to match our manual reorder and update display_order
      sortableList.value = newOrder.map((item, index) => ({
        ...item,
        display_order: index + 1,
      }))

      // Send the updated order to the server and wait for completion
      await handleOrderChange(updatedItems)

      // Clean up the stored data
      evt.from.removeAttribute('data-before-drag')

      // Reset flags after processing is complete
      setTimeout(() => {
        isUpdating.value = false
        isProcessingDrag.value = false
      }, 100)
    }
  },
})
</script>

<template>
  <div
    class="p-4 border border-[#E4E4E7CC] rounded-md min-w-[360px] bg-[#162D3A] h-fit overflow-y-auto"
  >
    <!-- Header -->
    <div class="flex gap-4 justify-between items-center pb-4 border-b border-white/10 mb-4">
      <div>
        <p class="text-white text-base font-medium mb-2">
          Display Order
        </p>
        <p class="text-white/70 text-xs">
          Drag and drop labels to change positions
        </p>
      </div>
      <Button variant="ghost" class="bg-white h-11 w-11 px-0" @click="refreshOrder">
        <Icon name="material-symbols:refresh" size="20" />
      </Button>
    </div>

    <!-- Draggable list -->
    <div
      ref="el"
      class="space-y-2 max-h-[calc(100vh-270px)] overflow-y-auto"
    >
      <div
        v-for="(item, index) in sortableList"
        :key="item.id"
        class="flex items-center h-[50px] rounded-md transition-colors border border-white/10 bg-[#1F3642] hover:bg-[#243945] cursor-move group"
      >
        <div class="flex items-center justify-center h-full rounded-l-md border border-white/10 w-12 bg-white/5 text-white text-sm font-medium">
          {{ index + 1 }}
        </div>
        <div class="flex-1 text-white text-sm font-medium p-3">
          {{ item.title }}
        </div>
        <div class="pr-1 flex items-center justify-center">
          <Icon
            name="material-symbols:drag-indicator"
            size="20"
            class="text-white/50 group-hover:text-white transition-colors"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #1F3642;
  border: 2px dashed #4A5568;
}

.chosen {
  background: #243945;
  border-color: #4A5568;
}

.drag {
  background: #243945;
  transform: rotate(5deg);
}
</style>
