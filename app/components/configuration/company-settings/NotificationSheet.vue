<script setup lang="ts">
import { Icon } from '#components'
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['update:open'])

const searchQuery = ref('')
const agents = ref([
  {
    agent: 'Alice Smith – alice.smith@pohnify.com – (+1 555 123 4567)',
    emailNotify: true,
    smsNotify: true,
  },
  {
    agent: 'Bob Johnson – bob.johnson@pohnify.com – (+1 555 234 5678)',
    emailNotify: false,
    smsNotify: true,
  },
  {
    agent: 'Charlie Brown – charlie.brown@pohnify.com – (+1 555 345 6789)',
    emailNotify: true,
    smsNotify: true,
  },
  {
    agent: 'Diana Prince – diana.prince@pohnify.com – (+1 555 456 7890)',
    emailNotify: false,
    smsNotify: true,
  },
  {
    agent: 'Ethan Hunt – ethan.hunt@pohnify.com – (+1 555 567 8901)',
    emailNotify: true,
    smsNotify: true,
  },
  {
    agent: 'Hannah Montana – hannah.montana@pohnify.com – (+1 555 890 1234)',
    emailNotify: true,
    smsNotify: false,
  },
])

const close = () => emit('update:open', false)
</script>

<template>
  <Sheet :open="props.open" @update:open="close">
    <SheetContent class="w-full md:max-w-[600px] max-h-[100vh] overflow-hidden flex flex-col h-full">
      <!-- Header -->
      <SheetHeader class="bg-[#173B3F] px-6 py-4">
        <SheetTitle class="text-white text-base font-normal">
          Notification for list uploaded/deleted
        </SheetTitle>
      </SheetHeader>

      <!-- Search -->
      <div class="relative px-4">
        <Input v-model="searchQuery" placeholder="Search Agents" class="pr-10" />
        <Icon class="absolute top-[9px] right-7" name="material-symbols:search" size="20" />
      </div>

      <!-- Table -->
      <div class="overflow-auto px-4 pb-6 flex-1">
        <table class="min-w-full text-sm">
            <thead class="border-b sticky top-0 bg-gray-50 z-10">
  <tr class="text-[#666] text-md font-normal">
    <th class="py-5 px-4 text-center font-normal">
      #
    </th>
    <th class="py-2 px-4 text-center font-normal">
      <div class="flex items-center justify-center gap-1">
        Agents
        <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
      </div>
    </th>
    <th class="py-2 px-4 text-center w-24 font-normal">
      <div class="flex items-center justify-center gap-1">
        Email
        <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
      </div>
    </th>
    <th class="py-2 px-4 text-center w-24 font-normal">
      <div class="flex items-center justify-center gap-1">
        SMS
        <Icon name="lucide:chevrons-up-down" class="w-4 h-4" />
      </div>
    </th>
  </tr>
</thead>

<tbody>
  <tr
    v-for="(agent, index) in agents"
    :key="index"
    class="border-t border-gray-100 hover:bg-gray-50"
  >
    <td class="py-6 px-4 text-[#162D3A] text-md text-center">
      {{ index + 1 }}
    </td>
    <td class="py-3 px-4 text-md text-[#162D3A] w-full">
      {{ agent.agent }}
    </td>
    <td class="py-3 px-4 text-center w-24">
      <Checkbox
        v-model="agent.emailNotify"
        class="data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]"
      />
    </td>
    <td class="py-3 px-4 text-center w-24">
      <Checkbox
        v-model="agent.smsNotify"
        class="data-[state=checked]:bg-[#16A34A] data-[state=checked]:border-[#16A34A]"
      />
    </td>
  </tr>
</tbody>
        </table>
      </div>
    </SheetContent>
  </Sheet>
</template>
