<script setup lang="ts">
import type { Extension } from '@/types/extension'
import { useDebounceFn } from '@vueuse/core'
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

const _props = defineProps({
  showButton: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['submit'])

const pageStart = ref(0)
const search = ref('')

const open = defineModel<boolean>()
const { data: extensions, status: extensionStatus, refresh: refreshExtensionList } = await useLazyAsyncData('extension-list-sheet', () =>
  useApi().get('extension', {
    params: {
      search: search.value,
    },
  }), {
  transform: res => res.data,
})

const debouncedSearch = useDebounceFn(() => {
  pageStart.value = 0
  refreshExtensionList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}

const selectedExtensions = defineModel<Extension[]>('selectedExtensions', { default: [] })

// Temporary selection state to prevent auto-save
const tempSelectedExtensions = ref<Extension[]>([])

// Sync temp state with actual selections when sheet opens
watch(open, (isOpen) => {
  if (isOpen) {
    // Clone the current selections to temp state
    tempSelectedExtensions.value = [...selectedExtensions.value]
  }
})

function handleCheckboxChange(id: any, extension: Extension) {
  const extensionData = {
    first_name: extension.first_name,
    last_name: extension.last_name,
    extension: extension.extension,
  }

  if (tempSelectedExtensions.value.some(item => item?.extension === extension?.extension)) {
    tempSelectedExtensions.value = tempSelectedExtensions.value.filter(
      item => item?.extension !== extension?.extension,
    )
  }
  else {
    tempSelectedExtensions.value.push(extensionData)
  }
}

function submit() {
  // Only update the parent's selectedExtensions when Save is clicked
  selectedExtensions.value = [...tempSelectedExtensions.value]
  emits('submit', selectedExtensions.value)
}
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetTrigger>
      <slot>
        <Button v-if="showButton" variant="outline" class="h-11">
          <Icon class="text-xl" name="material-symbols:add" />
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
          <BaseInputSearch v-model="search" class="w-full mt-1" placeholder="Search" @update:model-value="searchText" />
          <Separator class="my-3 bg-gray-100" />
          <template v-if="extensionStatus === 'pending'">
            <div v-for="n in 10" :key="n">
              <BaseSkelton classes="!rounded-none" class="h-10" />
              <Separator class="my-3 bg-gray-100" />
            </div>
          </template>
          <div v-if="extensionStatus === 'success' && extensions?.length === 0">
            <div class="text-center text-sm text-gray-500">
              No extensions found
            </div>
          </div>
          <div
            v-for="extension in extensions"
            v-else :key="extension.name" class="border-b border-gray-100 py-[19px]
          px-[12px] last:border-b-0 font-normal text-sm flex items-center justify-between"
          >
            <label :for="extension.id" class="cursor-pointer">
              {{ extension.first_name }} {{ extension.last_name }} - {{ extension.extension }}
            </label>
            <Checkbox
              :id="extension.id"
              :model-value="tempSelectedExtensions.some(item => item.extension === extension.extension)"
              class="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              @update:model-value="(checked) => handleCheckboxChange(extension.id, extension)"
            />
          </div>
        </div>
      </div>
      <SheetFooter class="">
        <SheetClose as-child>
          <Button :disabled="!tempSelectedExtensions.length" type="submit" class="h-[52px]" @click="submit">
            <Icon class="text-xl" name="material-symbols:save" />
            Save
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
