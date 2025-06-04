<script setup lang="ts">
import type { Extension } from '@/types/extension'
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

const props = defineProps({
  showButton: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['submit'])

const open = defineModel<boolean>()
const { data: extensions, status } = await useLazyAsyncData('extension', () =>
  useApi().get('extension'), {
  transform: (res) => {
    return res.data
  },
})

const selectedExtensions = defineModel<Extension[]>('selectedExtensions', { default: [] })

function handleCheckboxChange(id: any, extension: Extension) {
  const extensionData = {
    first_name: extension.first_name,
    last_name: extension.last_name,
    extension: extension.extension,
  }

  if (selectedExtensions.value.some(item => item.extension === extension.extension)) {
    selectedExtensions.value = selectedExtensions.value.filter(
      item => item.extension !== extension.extension,
    )
  }
  else {
    selectedExtensions.value.push(extensionData)
  }
}

function submit() {
  emits('submit', selectedExtensions.value)
  // selectedExtensions.value = []
}
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetTrigger>
      <slot>
        <Button v-if="showButton" variant="outline" class="h-11">
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
          <template v-if="status === 'pending'">
            <div v-for="n in 10" :key="n">
              <BaseSkelton classes="!rounded-none" class="h-10" />
              <Separator class="my-3 bg-gray-100" />
            </div>
          </template>
          <div
            v-for="extension in extensions"
            v-else :key="extension.name" class="border-b border-gray-100 py-[19px]
          px-[12px] last:border-b-0 font-normal text-sm flex items-center justify-between"
          >
            <label :for="extension.id" class="cursor-pointer">
              {{ extension.first_name }} {{ extension.last_name }} - {{ extension.id }}
            </label>
            <Checkbox
              :id="extension.id"
              :model-value="selectedExtensions.some(item => item.extension === extension.extension)"
              class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              @update:model-value="(checked) => handleCheckboxChange(extension.id, extension)"
            />
          </div>
        </div>
      </div>
      <SheetFooter class="">
        <SheetClose as-child>
          <Button type="submit" class="h-[52px]" @click="submit">
            <Icon name="mdi:plus" />
            Add Extension
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
