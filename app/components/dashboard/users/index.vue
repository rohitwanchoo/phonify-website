<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'

const users = [
    {
        id: 0,
        name: 'All Users'
    },
  {
    id: 1,
    name: 'John Doe',
  },
  {
    id: 2,
    name: 'Jane Doe',
  },
  {
    id: 3,
    name: 'John Smith',
  },
]
const filters = [
  {
    id: 1,
    name: 'Monthly'
  },
  {
    id: 2,
    name: 'Weekly'      
  },
  {
    id: 3,
    name: 'Daily'
  }
]
const selectedUser = ref(0)
const selectedFilter = ref(1)

const data = [
  {
    id: 1,
    title: 'Outbound Manual',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 2,
    title: 'Outbound ',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 3,
    title: 'Inbound Manual Calls',
    calls: '23,849',
    avgDuration: '00:12:32',
  },
  {
    id: 4,
    title: 'Inbound Dialer Calls',
    calls: '23,849',
    avgDuration: '00:12:32',
  }
]
</script>

<template>
    <div class="border rounded-lg p-5">   
        <div class="flex item-center justify-between">
            <Select v-model="selectedUser" >
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="user in users" :key="user.id"  :value="user.id">
                            {{ user.name }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <Select v-model="selectedFilter" >
                <SelectTrigger class="w-[130px]">
                    <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="filter in filters" :key="filter.id"  :value="filter.id">
                            {{ filter.name }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
        <Separator class="my-6"  />
        <div class="grid grid-cols-1 lg:grid-cols-7 w-full gap-4">
            <div class="col-span-4">
                <DashboardUsersChart></DashboardUsersChart>
            </div>
            <div class="grid grid-cols-2 w-full col-span-3 gap-4">
                <div v-for="item in data" :key="item.id" class="bg-white rounded-lg border p-3 w-full max-h-[103px]  col-span-2 md:col-span-1">
                    <h2 class="text-sm font-medium text-black mb-5">{{ item.title }}</h2>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-[#000000B2] text-xs font-normal">Calls</span>
                            <span class="text-[#1D3E51] font-medium text-xs">{{ item.calls }}</span>
                        </div>
                            <div class="flex justify-between items-center">
                                <span class="text-[#000000B2] text-xs font-normal">Avg Duration</span>
                                <span class="text-[#000000B2] text-xs font-normal">{{ item.avgDuration }}</span>
                            </div>
                    </div>
                </div>
                <div class="border col-span-2 rounded-lg p-3 flex item-center justify-between text-sm font-medium">
                   <div>
                        Total Agents Logged In
                   </div>
                   <div>
                         43
                   </div>
                </div>
            </div>
            
        </div>

    </div>
</template>