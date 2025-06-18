<script setup lang="ts">
import { ref } from 'vue'
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

const callLogs = [
  {
    id: 1,
    user: {
      name: 'Alice Smith',
      id: '33184',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    timestamp: '2025-01-25T13:42:53',
    phone: '9024412385',
    status: 'Callback',
    icon:'material-symbols:play-circle'
  },
  {
    id: 2,
    user: {
      name: 'John Doe',
      id: '22891',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    timestamp: '2025-01-26T09:15:12',
    phone: '9835519876',
    status: '',
    icon: 'material-symbols:chat'
  },
  {
    id: 3,
    user: {
      name: 'Smith',
      id: '22891',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    timestamp: '2025-01-26T09:15:12',
    phone: '9835519876',
    status: 'Cancelled User',
  icon:'material-symbols:play-circle'
  },
]

const dummyData = ref([
  { id: 1, extension: '123456', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, extension: '234567', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, extension: '345678', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: 4, extension: '456789', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
])

const countryCode = [
  { id: 1, name: 'United States' },
  { id: 2, name: 'United Kingdom' },
  { id: 3, name: 'Canada' },
]

// Track selected value for each log by id
const selectedCountryCodes = ref<{ [id: number]: string }>({})

const formatDate = (iso: string) => {
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

// Helper to get audioUrl by log id
function getAudioUrl(id: number) {
  return dummyData.value.find(d => d.id === id)?.audioUrl || ''
}
const visibleAudioId = ref<number | null>(null)

function toggleAudio(id: number) {
  visibleAudioId.value = visibleAudioId.value === id ? null : id
}
</script>


<template>
    <div class="mx-auto bg-[#FAFAFA] space-y-2">
      <div
        v-for="log in callLogs"
        :key="log.id"
        class="border border-[#F4F4F5] rounded-md p-2 gap-4 bg-white"
      >
        <!-- Top Row: Avatar + Details + Actions -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <img
              :src="log.user.avatar"
              alt="Avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p class="text-sm text-gray-500">{{ formatDate(log.timestamp) }}</p>
              <p class="text-sm text-gray-800">
                <span class="font-sm">{{ log.user.name }}</span>
                <span> ({{ log.user.id }})</span>
                <span class="text-gray-500"> made a manual call to </span>
                <span class="font-sm">{{ log.phone }}</span>
              </p>
            </div>
          </div>
  
          <div class="flex items-center gap-2">
            <!-- Dropdown if log.id === 3 -->
            <template v-if="log.id === 3">
              <FormField v-slot="{ componentField }" name="countryCode">
                <FormItem>
                  <FormControl>
                    <Select
                      v-bind="componentField"
                      v-model="selectedCountryCodes[log.id]"
                    >
                      <SelectTrigger class="min-w-[150px] !h-11">
                        <SelectValue class="text-[12px] placeholder:text-[#ef698180]" placeholder="Select Code" />
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
            </template>
  
            <!-- Status button only if status exists -->
            <template v-else-if="log.status && log.status.trim() !== ''">
              <button
                class="text-[12px] px-3 py-1 border border-[#00A086] bg-[#00A0861A] text-black rounded-md text-center min-w-[150px]"
              >
                {{ log.status }}
              </button>
            </template>
  
            <!-- Only show play/close icon if not chat -->
            <button
              v-if="log.icon !== 'material-symbols:chat' && getAudioUrl(log.id)"
              @click="toggleAudio(log.id)"
              class="w-8 h-8 flex items-center justify-center border border-primary rounded-md"
            >
              <Icon :name="visibleAudioId === log.id ? 'material-symbols:close' : 'material-symbols:play-circle'" />
            </button>
            <!-- Chat icon button if needed -->
            <button
              v-if="log.icon === 'material-symbols:chat'"
              class="w-8 h-8 flex items-center justify-center border border-primary rounded-md"
            >
              <Icon name="material-symbols:chat" />
            </button>
          </div>
        </div>
  
        <!-- Audio shown below the entire block, only for play-circle -->
        <Transition>
          <div v-if="visibleAudioId === log.id && getAudioUrl(log.id)" class="mt-4">
            <audio controls class="w-full h-[40px]">
              <source :src="getAudioUrl(log.id)" type="audio/mpeg" />
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