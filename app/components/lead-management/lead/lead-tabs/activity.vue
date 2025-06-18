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
     icon: 'material-symbols:chat'
  },
]

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
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>


<template>
    <div class=" mx-auto bg-[#FAFAFA]  space-y-2">
      <div
        v-for="log in callLogs"
        :key="log.id"
        class="flex items-center justify-between border border-[#F4F4F5]  rounded-md p-2 gap-4  bg-white"
      >
  
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
          <template v-else-if="log.status && log.status.trim() !== ''">
          <button
            class="text-[12px] px-3 py-1 border border-[#00A086] bg-[#00A0861A] text-black rounded-md text-center min-w-[150px]"
          >
            {{ log.status }}
          </button>
        </template>
          <button
            v-if="log.icon && log.icon.trim() !== ''"
            class="w-8 h-8 flex items-center justify-center border border-primary rounded-md"
          >
            <Icon :name="log.icon" />
          </button>
        </div>
      </div>
    </div>
  </template>

