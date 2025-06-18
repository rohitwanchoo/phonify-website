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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'

const agentCodeOptions = [
  { id: 1, number: '2397463978'},
  { id: 2, number: '2397463978 ' },
  { id: 3, number: '2397463978 '},
]

const agentCode = ref('')
const faxNumber = ref('')
</script>
<template>
  <div class="flex gap-4 items-end">
    <FormField v-slot="{ componentField }" name="From">
      <FormItem>
        <FormLabel class="font-normal text-sm">From</FormLabel>
        <FormControl>
          <Select v-bind="componentField" v-model="agentCode">
            <SelectTrigger class="min-w-[120px] !h-11">
              <SelectValue class="text-[12px] placeholder:text-[#ef698180]" placeholder="Agent Number" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in agentCodeOptions" :key="item.id" :value="item.code">
                  {{ item.number }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage class="text-sm" />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="faxNumber">
      <FormItem>
        <FormLabel class="font-normal text-sm">Fax Number</FormLabel>
        <FormControl>
          <Input v-bind="componentField" v-model="faxNumber" type="text" placeholder="Enter Fax Number" class="!h-11 text-sm" />
        </FormControl>
        <FormMessage class="text-sm" />
      </FormItem>
    </FormField>
  </div>
</template>