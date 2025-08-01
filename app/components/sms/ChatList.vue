<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'

const props = defineProps({
  currentContactId: {
    type: Number,
    default: 1,
  },
})
const emit = defineEmits(['select-contact'])

const isFilterOpen = ref(false)

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value
}
const extensionGroup = [
  { id: 1, title: 'Vanessa Bogan', number: '+1 (569) 912-3502', time: '10.00 am' },
  { id: 42, title: 'Kristin Cormier', number: '+1 (802) 345-2289', time: '10.00 am' },
  { id: 43, title: 'Jeffrey Hintz', number: '+1 (213) 678-4432', time: '10.00 am' },
  { id: 44, title: 'Unknown User', number: '+1 (900) 123-9911', time: '10.00 am' },
  { id: 45, title: 'Alexis Carroll', number: '+1 (324) 556-7821', time: '10.00 am' },
  { id: 46, title: 'Leonard Carter', number: '+1 (418) 210-4456', time: '10.00 am' },

]

const selected = ref('last7')

const options = [
  { label: 'Last 7 Days', value: 'last7' },
  { label: 'Last 30 Days', value: 'last30' },
  { label: 'Custom Date', value: 'custom' },
  { label: 'All Chats', value: 'all' },
]

function handleTabSelect(groupId: number) {
  const group = extensionGroup.find(g => g.id === groupId)
  if (group) {
    emit('select-contact', group)
  }
}
</script>

<template>
  <div class="bg-primary p-[18px] h-[calc(100vh-150px)] flex flex-col">
    <div class="flex items-center gap-3 mb-4">
      <div class="relative flex-1">
        <Input class="bg-white h-11 pr-10" placeholder="Search here..." />
        <Icon name="lucide:search" class="absolute text-gray-900 top-1/2 right-3 -translate-y-1/2" />
      </div>

      <DropdownMenu v-model:open="isFilterOpen">
        <DropdownMenuTrigger as-child>
          <Button
            variant="outline"
            size="icon"
            class="h-11 w-11 border transition-all duration-200"
            :class="isFilterOpen
              ? 'bg-white text-black border-white hover:bg-white hover:text-black'
              : 'bg-[#1717170d] text-white border-white hover:bg-[#605f5f64] hover:text-white'"
          >
            <Icon
              :name="isFilterOpen ? 'material-symbols:menu' : 'material-symbols:sort'"
              size="23"
            />  
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 p-2 bg-white rounded-lg shadow-md">
          <!-- Arrow Pointer -->
          <!-- <div class="absolute -top-2 right-3 z-0">
                <div class="w-4 h-4 bg-white rotate-45 border border-gray-200" />
              </div> -->

          <div class="space-y-3">
            <p class="text-sm font-medium text-gray-500 px-2 pt-1">
              Filter Options
            </p>

            <DropdownMenuGroup>
              <DropdownMenuItem
                v-for="option in options"
                :key="option.value"
                class="cursor-pointer px-2 py-1.5 rounded hover:bg-gray-50"
                @select.prevent
              >
                <div class="flex items-center space-x-2 w-full">
                  <input
                    :id="option.value"
                    v-model="selected"
                    type="radio"
                    :value="option.value"
                    class="appearance-none w-3 h-3 border border-[#1C2B36] rounded-full checked:bg-[#00A086] checked:border-[#00A086] focus:ring-1 transition-colors duration-200"
                  >
                  <label :for="option.value" class="text-sm text-[#1C2B36] cursor-pointer w-full">
                    {{ option.label }}
                  </label>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <Separator class="my-2 bg-[#FFFFFF1A]" />

    <ScrollArea class="h-[calc(100vh-210px)] overflow-y-auto overflow-x-hidden flex-1">
      <Tabs orientation="vertical" class="space-y-2 h-full" :model-value="currentContactId">
        <TabsList class="flex flex-col h-full gap-y-2 bg-transparent w-full mt-1 overflow-y-auto overflow-x-hidden">
          <TabsTrigger
            v-for="group in extensionGroup"
            :key="group.id"
            :value="group.id"
            class="h-[84px] p-4 flex-shrink-0 w-full border border-[#FFFFFF1A] bg-[#FFFFFF0D] text-white data-[state=active]:bg-[#00A086] mr-2 rounded-[8px] flex items-center justify-between px-[16px] !text-sm !font-normal cursor-pointer hover:bg-[#FFFFFF0D]/80 relative data-[state=inactive]:after:hidden after:absolute after:-right-[16px] after:border-8 after:border-transparent after:border-l-[#00A086]"
            @click="handleTabSelect(group.id)"
          >
            <div class="flex items-center gap-x-3 truncate">
              <div class="w-10 h-10 rounded-full bg-[#FFFFFF66] text-white flex items-center justify-center text-sm font-semibold uppercase">
                {{ group.title.split(' ').map(w => w[0]).join('').slice(0, 2) }}
              </div>
              <div class="truncate leading-tight text-left">
                <div class="truncate">
                  {{ group.title }}
                </div>
                <div class="text-xs text-white opacity-70">
                  {{ group.number }}
                </div>
              </div>
            </div>
            <div class="text-xs text-white opacity-70 whitespace-nowrap">
              {{ group.time }}
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </ScrollArea>
  </div>
</template>
