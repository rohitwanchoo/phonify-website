<script lang="ts" setup>
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import Actions from '../Actions.vue'

interface ExtensionGroup {
  id: string
  title: string
  count: number
}

defineProps<{
  loading: boolean
  extensionGroup: ExtensionGroup[]
}>()

const emits = defineEmits(['onRename', 'onDelete'])

function deleteGroup(group: ExtensionGroup) {
  emits('onDelete', group)
}
</script>

<template>
  <Tabs orientation="vertical" class="space-y-2 h-full ml-[2px]">
    <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full">
      <template v-if="loading">
        <BaseSkelton v-for="i in 7" :key="i" class="h-14 w-full mb-2" rounded="rounded-sm" />
      </template>

      <TabsTrigger
        v-for="group in extensionGroup"
        v-else :key="group.title" :value="group.id" class="min-h-[56px] w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:bg-[#00A086] mr-2
               rounded-[8px] flex items-center justify-between px-[16px] !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80 relative data-[state=inactive]:after:hidden after:absolute after:-right-[16px] after:border-8 after:border-transparent after:border-l-[#00A086] "
      >
        <div class="truncate">
          {{ group?.title }}
        </div>
        <div class="flex items-center gap-x-1">
          <div class="bg-[#FFFFFF14] px-2 py-1.5 flex items-center rounded-[6px] text-xs gap-x-1">
            <Icon name="clarity:user-line" size="13" />
            {{ group?.count }}
          </div>
          <Actions @on-delete="deleteGroup(group)" @on-rename="emits('onRename', group)" />
        </div>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
