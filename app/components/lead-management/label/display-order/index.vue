<script setup lang="ts">
import Button from '~/components/ui/button/Button.vue'

const items = ref([
  { id: 1, name: 'New label' },
  { id: 2, name: 'Business Type' },
  { id: 3, name: 'Current Phone System' },
  { id: 4, name: 'No. of Open Loans' },
  { id: 5, name: 'Factor Rate' },
  { id: 6, name: 'Annual Revenue' },
  { id: 7, name: 'Business Age' },
  { id: 8, name: 'Credit Score' },
  { id: 9, name: 'Lead Source' },
  { id: 10, name: 'Monthly Revenue' },
  { id: 11, name: 'First Name' },
  { id: 12, name: 'Email' },
  { id: 13, name: 'Funding Amount' },
  { id: 14, name: 'ZIP' },
  { id: 15, name: 'State' },
  { id: 16, name: 'City' },
  { id: 17, name: 'Mobile' },
  { id: 18, name: 'Work Phone' },
  { id: 19, name: 'Legal Company' },
  { id: 20, name: 'Last Name' },
])

function reorder(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex)
    return

  const newItems = [...items.value]
  const [movedItem] = newItems.splice(fromIndex, 1)
  newItems.splice(toIndex, 0, movedItem)
  items.value = newItems
}

function resetOrder() {
  items.value = [
    { id: 1, name: 'New label' },
    { id: 2, name: 'Business Type' },
    { id: 3, name: 'Current Phone System' },
    { id: 4, name: 'No. of Open Loans' },
    { id: 5, name: 'Factor Rate' },
    { id: 6, name: 'Annual Revenue' },
    { id: 7, name: 'Business Age' },
    { id: 8, name: 'Credit Score' },
    { id: 9, name: 'Lead Source' },
    { id: 10, name: 'Monthly Revenue' },
    { id: 11, name: 'First Name' },
    { id: 12, name: 'Email' },
    { id: 13, name: 'Funding Amount' },
    { id: 14, name: 'ZIP' },
    { id: 15, name: 'State' },
    { id: 16, name: 'City' },
    { id: 17, name: 'Mobile' },
    { id: 18, name: 'Work Phone' },
    { id: 19, name: 'Legal Company' },
    { id: 20, name: 'Last Name' },
  ]
}
</script>

<template>
  <div
    class="p-4 border border-[#E4E4E7CC] rounded-md w-full max-w-[360px] bg-[#162D3A] h-[calc(100vh-145px)] overflow-y-auto">
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

    <div class="space-y-2 overflow-hidden">
      <LeadManagementLabelDisplayOrderDragBox
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :index="index"
        :items="items"
        @reorder="reorder"
      />
    </div>
  </div>
</template>
