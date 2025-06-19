<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'

const props = defineProps<{
  labelList: { id: number, title: string, order: number }[] | undefined
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'updateOrder', value: { id: number, title: string, order: number }[]): void
}>()

const labelList = ref<{ id: number, title: string, order: number }[]>([])

// ✅ Watch for changes when API data arrives
watch(
  () => props.labelList,
  (newList) => {
    if (newList) {
      labelList.value = [...newList]
    }
  },
  { immediate: true },
)

function reorder(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex)
    return

  const newItems = [...labelList.value]
  const [movedItem] = newItems.splice(fromIndex, 1)
  newItems.splice(toIndex, 0, movedItem)
  labelList.value = newItems

  emit('updateOrder', newItems)
}

function resetOrder() {
  labelList.value = props.labelList ? [...props.labelList] : []
}
</script>

<template>
  <div
    class="p-4 border border-[#E4E4E7CC] rounded-md min-w-[360px] bg-[#162D3A] h-fit max-h-[calc(100vh-145px)] overflow-y-auto"
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
      <Button variant="ghost" class="bg-white h-11 w-11 px-0" @click="resetOrder">
        <Icon name="material-symbols:refresh" size="20" />
      </Button>
    </div>
    <!-- Loader -->
    <div v-if="props.loading" class="space-y-2">
      <div v-for="i in 7" :key="i" class="flex items-center gap-3 p-3 bg-white/5 rounded-md">
        <div class="h-6 w-6 bg-white/20 rounded-md animate-pulse" />
        <div class="flex-1 h-4 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
    <!-- Draggable list -->
    <div v-else class="space-y-2 overflow-hidden">
      <LeadManagementLabelDisplayOrderDragBox
        v-for="(item, index) in labelList"
        :key="item.id"
        :item="item"
        :index="index"
        :items="labelList"
        @reorder="reorder"
      />
    </div>
  </div>
</template>
