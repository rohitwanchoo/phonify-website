<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps({
  leadActivityData: Object,
  activityLoading: Boolean,
})

const countryCode = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'United Kingdom' },
  { id: 3, name: 'Canada' },
]

// Track selected value for each log by id
const selectedCountryCodes = ref<{ [id: number]: string }>({})

// get disposition name from id
const { data: dispositionList } = await useLazyAsyncData('get-disposition-list-activity-lo', () =>
  useApi().post('/disposition', {

  }), {
  transform: (res) => {
    return res.data
  },
})

// get disposition name from id
function getDispositionName(id: number): string {
  const disposition = dispositionList.value?.find((item: { id: number, title: string }) => item.id === id)
  return disposition?.title || 'N/A'
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(',', '')
}

const visibleItem = ref<number | null>(null)

function toggleAudio(id: number) {
  visibleItem.value = visibleItem.value === id ? null : id
}

function toggleMessage(id: number) {
  visibleItem.value = visibleItem.value === id ? null : id
}
</script>

<template>
  <div v-if="activityLoading">
    <BaseSkelton v-for="i in 9" :key="i" class="h-14 w-full mb-2" rounded="rounded-sm" />
  </div>
  <div v-else-if="!leadActivityData?.data.updateData.length" class="h-[calc(100vh-260px)] overflow-hidden flex items-center justify-center">
    <div class="text-center text-gray-500 py-8">
      No activity logs available
    </div>
  </div>

  <div v-else class="mx-auto bg-[#FAFAFA] space-y-2">
    <div
      v-for="log in leadActivityData?.data.updateData"
      :key="log.id"
      class="border border-[#F4F4F5] rounded-md p-2 gap-4 bg-white"
    >
      <!-- {{ props.leadActivityData }} -->
      <!-- Top Row: Avatar + Details + Actions -->
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div
            alt="Avatar"
            class="w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Icon name="mdi:account-circle" size="30" class="  text-[#00A086]" />
          </div>
          <div>
            <p class="text-xs md:text-sm text-gray-500">
              {{ formatDate(log.start_time) }}
            </p>
            <p class="text-xs md:text-sm text-gray-800">
              <span class="font-sm">{{ log?.extension || 'Unknown' }}</span>
              <span> ({{ log?.cli || 'N/A' }})</span>
              <span class="text-gray-500">  to </span>
              <span class="font-sm">{{ log?.number || 'N/A' }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div v-if="log.call_recording && log.disposition_id" class="text-[12px] border border-[#00A086] rounded-md px-2 h-[28px] flex items-center justify-center bg-[#00A0861A]">
            {{ getDispositionName(log?.disposition_id) }}
          </div>
          <!-- Dropdown if log.id === 3 -->
          <!-- <template v-if="log.id === 3">
            <FormField v-slot="{ componentField }" name="countryCode">
              <FormItem>
                <FormControl>
                  <Select
                    v-bind="componentField"
                    v-model="selectedCountryCodes[log.id]"
                  >
                    <SelectTrigger class="min-w-[150px] !h-8">
                      <SelectValue class="text-[12px] placeholder:text-[#ef698180]" placeholder="Select Disposition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="item in countryCode" :key="item.id" :value="item.name">
                          {{ item.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage class="text-sm" />
              </FormItem>
            </FormField>
          </template> -->

          <!-- Status button only if status exists -->
          <!-- <template v-else-if="log.status && log.status.trim() !== ''">
            <button
              class="text-[12px] px-3 py-1 border border-[#00A086] bg-[#00A0861A] text-black rounded-md text-center min-w-[150px]"
            >
              {{ log.status }}
            </button>
          </template> -->

          <!-- Only show play/close icon if not chat -->
          <Button
            v-if="log.call_recording"
            variant="outline"
            size="icon"
            class="w-8 h-8 flex items-center justify-center border border-primary rounded-md"
            @click="toggleAudio(log.id)"
          >
            <Icon :name="visibleItem === log.id ? 'material-symbols:close' : 'material-symbols:play-circle'" />
          </Button>
          <!-- Chat icon button if needed -->
          <Button
            v-if="log.message"
            variant="outline"
            size="icon"
            class="w-8 h-8 flex items-center justify-center border border-primary rounded-md "
            @click="toggleMessage(log.id)"
          >
            <Icon :name="visibleItem === log.id ? 'material-symbols:close' : 'material-symbols:chat'" />
          </Button>
        </div>
      </div>
      <Transition>
        <div v-if="visibleItem === log.id && log.message" class="mt-4 px-4 pb-2">
          <p class="text-sm md:text-md text-gray-800">
            {{ log.message }}
          </p>
        </div>
      </Transition>

      <!-- Audio shown below the entire block, only for play-circle -->
      <Transition>
        <div v-if="visibleItem === log.id && log.call_recording" class="mt-4">
          <audio controls class="w-full h-[40px]">
            <source :src="log.call_recording" type="audio/mpeg">
          </audio>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
