<script setup lang="ts">
import { Button } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Checkbox } from '~/components/ui/checkbox'

import { Input } from '~/components/ui/input'

const open = defineModel<boolean>()

const extensions = [
  {
    name: 'Emma Thompson',
    id: '454354',
  },
  {
    name: 'Marcus Chen',
    id: '789012',
  },
  {
    name: 'Sofia Rodriguez',
    id: '345678',
  },
  {
    name: 'Aiden Patel',
    id: '901234',
  },
  {
    name: 'Isabella Kim',
    id: '567890',
  },
  {
    name: 'Liam Lee',
    id: '123456',
  },
  {
    name: 'Mia Garcia',
    id: '234567',
  },
  {
    name: 'Mia Garcia',
    id: '234561',
  },
  {
    name: 'Mia Garcia',
    id: '234562',
  },
  {
    name: 'Mia Garcia',
    id: '234563',
  },
  {
    name: 'Mia Garcia',
    id: '234564',
  },
  {
    name: 'Mia Garcia',
    id: '234565',
  },
  {
    name: 'Mia Garcia',
    id: '234566',
  },
  {
    name: 'Mia Garcia',
    id: '234567',
  },

  {
    name: 'Mia Garcia',
    id: '234568',
  },
  {
    name: 'Mia Garcia',
    id: '234569',
  },
  {
    name: 'Mia Garcia',
    id: '2345610',
  },
]
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetTrigger>
      <slot>
        <Button variant="outline" class="h-11">
          <Icon name="mdi:plus" />
          Add Extension
        </Button>
      </slot>
    </SheetTrigger>
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          Extensions
        </SheetTitle>
      </SheetHeader>
      <div class="overflow-y-auto">
        <div class=" mx-auto px-5 overflow-y-auto">
          <div class="flex gap-x-2">
            <div class="relative flex-1">
              <Input class="h-11 focus-visible:ring-0 " placeholder="Search Extension" />
              <Icon name="lucide:search" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
            <Button variant="outline" size="icon" class="border-gray-200 h-11 w-11">
              <Icon name="material-symbols:sort" />
            </Button>
          </div>
          <Separator class="my-3 bg-gray-100" />
          <div
            v-for="extension in extensions" :key="extension.name" class="border-b border-gray-100 py-[19px]
          px-[12px] last:border-b-0 font-normal text-sm flex items-center justify-between"
          >
            <label :for="extension.id" class="cursor-pointer">
              {{ extension.name }} - {{ extension.id }}
            </label>
            <Checkbox :id="extension.id" class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
          </div>
        </div>
      </div>
      <SheetFooter class="">
        <SheetClose as-child>
          <Button type="submit" class="h-[52px]">
            <Icon name="mdi:plus" />
            Add Extension
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
