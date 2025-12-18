<script setup lang="ts">
// type imports above; local imports below
import type { PropType } from 'vue'
// external/type imports above; local imports below
import { Icon } from '#components'
// external/type imports above; local imports below
import { nextTick, onMounted } from 'vue'
// external/type imports above; local imports below
import { Checkbox } from '@/components/ui/checkbox'
// external/type imports above; local imports below
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: Array as () => any[],
    default: () => [],
  },
  options: {
    type: Array as () => any[],
    required: true,
  },
  valueKey: {
    type: String,
    default: 'id',
  },
  labelKey: {
    type: String,
    default: 'name',
  },
  disableFunction: {
    type: Function as PropType<(item: any) => boolean>,
    default: (_item: any) => false,
  },
  formatSearch: {
    type: Function as PropType<(search: string) => string>,
    default: (search: string) => search,
  },
  placeholder: {
    type: String,
    default: 'Select items...',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search items...',
  },
  returnType: {
    type: [String, Array] as PropType<string | string[]>,
    default: 'valueKey', // other options: 'full', ['id', 'name']
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  by: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: 'default-select',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  triggerStyle: {
    type: String,
  },
  icon: {
    type: String,
  },
  // Optional server-side search support
  asyncSearch: {
    type: Function as PropType<(query: string) => Promise<any[]>>,
  },
  searchDebounceMs: {
    type: Number,
    default: 300,
  },
  minSearchChars: {
    type: Number,
    default: 0,
  },
  fetchOnOpen: {
    type: Boolean,
    default: true,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  // Prefetch support
  prefetchOnMount: {
    type: Boolean,
    default: false,
  },
  prefetchQuery: {
    type: String,
    default: '',
  },
  usePortal: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue'])

const open = ref(false)
const searchTerm = ref('')
const selectedItems = ref(Array.isArray(props.modelValue) ? props.modelValue : [])
const remoteOptions = ref<any[]>([])
const isLoading = ref(false)
let searchTimer: any

// Add this watcher to sync selectedItems when modelValue changes externally
watch(() => props.modelValue, (newValue) => {
  selectedItems.value = Array.isArray(newValue) ? newValue : []
}, { immediate: true })

// Only pass `by` when returning objects (full or partial)
const isReturningObject = computed(() => {
  if (Array.isArray(props.returnType))
    return true
  if (typeof props.returnType === 'string')
    return props.returnType === 'full'
  return false
})
const comboboxBy = computed(() => (isReturningObject.value ? (props.by || undefined) : undefined))

if (import.meta.dev) {
  watchEffect(() => {
    if (props.by && !isReturningObject.value) {
      console.warn('[SelectMenu] "by" prop is ignored because returnType returns primitives. Remove "by" or use return-type="full"/partial.')
    }
  })
}

const comboboxModel = computed({
  get() {
    return props.multiple ? selectedItems.value : (selectedItems.value?.[0] ?? null)
  },
  set(val: any) {
    if (props.multiple) {
      selectedItems.value = Array.isArray(val) ? val : (val == null ? [] : [val])
    }
    else {
      // For single select same item select deselect
      const currentSelection = selectedItems.value?.[0]
      if (val != null && compareItems(val, currentSelection)) {
        selectedItems.value = []
      }
      else {
        selectedItems.value = val != null ? [val] : []
      }
    }
    emits('update:modelValue', selectedItems.value)
  },
})

function filterFunction(items: any[], searchTerm: string): any[] {
  const formattedSearch = props.formatSearch?.(searchTerm?.toLocaleLowerCase())
  return items.filter((item) => {
    return item?.[props.labelKey]?.toLowerCase().includes(formattedSearch)
  })
}

function onOpenChange(nextOpen: boolean) {
  open.value = nextOpen
  // Always clear search when toggling to avoid selected id/value appearing in the input
  searchTerm.value = ''
  // Clear again on the next tick to override any internal assignment
  nextTick(() => {
    searchTerm.value = ''
    // Final safeguard after internal updates (microtask + macrotask)
    setTimeout(() => {
      searchTerm.value = ''
    }, 0)
  })

  if (props.asyncSearch) {
    if (nextOpen && props.fetchOnOpen)
      void performServerSearch(true) // fetch even if below min chars on open
    if (!nextOpen) {
      if (searchTimer)
        clearTimeout(searchTimer)
      isLoading.value = false
    }
  }
}

async function performServerSearch(ignoreMin = false, overrideQuery?: string) {
  if (!props.asyncSearch)
    return
  const q = overrideQuery != null ? overrideQuery : searchTerm.value
  const term = String(props.formatSearch?.(q) ?? q)
  if (!ignoreMin && term.length < props.minSearchChars)
    return
  isLoading.value = true
  try {
    const results: any = await props.asyncSearch(term)
    // Allow returning either raw array or an object with data array
    const items = Array.isArray(results) ? results : (results && Array.isArray(results.data) ? results.data : [])
    remoteOptions.value = Array.isArray(items) ? items : []
  }
  catch {
    remoteOptions.value = []
  }
  finally {
    isLoading.value = false
  }
}

function queueServerSearch() {
  if (!props.asyncSearch)
    return
  if (searchTimer)
    clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    void performServerSearch()
  }, props.searchDebounceMs)
}

watch([open, () => searchTerm.value, () => props.asyncSearch], ([isOpen]) => {
  if (!props.asyncSearch)
    return
  if (!isOpen)
    return
  if (searchTerm.value.length < props.minSearchChars) {
    remoteOptions.value = []
    return
  }
  queueServerSearch()
})

// Prefetch on mount (better UX)
onMounted(() => {
  if (props.asyncSearch && props.prefetchOnMount) {
    void performServerSearch(true, props.prefetchQuery)
  }
})

function isItemDisabled(item: any) {
  try {
    return props.disableFunction ? props.disableFunction(item) : false
  }
  catch {
    return false
  }
}

const sourceOptions = computed<any[]>(() => (props.asyncSearch ? (remoteOptions.value ?? []) : (props.options ?? [])))

const sortedOptions = computed(() => {
  const selected = sourceOptions.value?.filter((item: any) => selectedItems.value?.some((val: any) => compareItems(getItemValue(item), val))) ?? []
  const unselected = sourceOptions.value?.filter((item: any) => !selectedItems.value?.some((val: any) => compareItems(getItemValue(item), val))) ?? []
  return selected.concat(unselected)
})

const filteredOptions = computed(() => {
  if (props.asyncSearch)
    return sortedOptions.value ?? []
  if (!searchTerm.value)
    return sortedOptions.value ?? []
  return filterFunction(sortedOptions.value ?? [], searchTerm.value)
})

// Ensure internal Combobox filtering doesn't run when using asyncSearch by
// making each item's text-value always contain the current search term.
// This prevents double-filtering (server + client) based on labelKey.
function getTextValue(item: any) {
  const label = String(item?.[props.labelKey] ?? '')
  if (props.asyncSearch)
    return `${label} ${String(searchTerm.value ?? '')}`
  return label
}

function getItemValue(item: any) {
  if (typeof props.returnType === 'string') {
    switch (props.returnType) {
      case 'full':
        return item
      default:
        return item?.[props.valueKey]
    }
  }
  else if (Array.isArray(props.returnType)) {
    // If returnType is an array, return an object with specified keys
    const partialItem: Record<string, any> = {}
    for (const key of props.returnType)
      partialItem[key] = item?.[key]

    return partialItem
  }
}

function compareItems(item1: any, item2: any) {
  if (typeof item1 === 'object' && typeof item2 === 'object') {
    if (props.by)
      return item1?.[props.by] === item2?.[props.by]
    return JSON.stringify(item1) === JSON.stringify(item2)
  }

  // Coerce primitives to string to avoid number vs string mismatches
  return String(item1) === String(item2)
}

// Selection is handled by Combobox via v-model. Keep helpers for other actions below.

function resetSelections() {
  if (props.multiple)
    comboboxModel.value = []
  else
    comboboxModel.value = null
}
function getLabelForValue(val: any) {
  if (typeof props.returnType === 'string' && props.returnType === 'full' && typeof val === 'object')
    return val?.[props.labelKey]
  // Use current source options (local or remote) to resolve the label for a primitive value
  const option = sourceOptions.value?.find((opt: any) => compareItems(getItemValue(opt), val))
  return option?.[props.labelKey]
}

// selection-all handled via onSelectAllChange

const selectAllState = computed(() => {
  if (!props.multiple)
    return false

  const enabled = sourceOptions.value?.filter((item: any) => !isItemDisabled(item)) ?? []
  if (enabled.length === 0)
    return false

  const selectedEnabledCount = enabled.filter((item: any) => selectedItems.value?.some((val: any) => compareItems(val, getItemValue(item)))).length
  if (selectedEnabledCount === 0)
    return false
  if (selectedEnabledCount === enabled.length)
    return true
  return 'indeterminate'
})

function onSelectAllChange(next: boolean | 'indeterminate') {
  if (!props.multiple)
    return

  const allEnabledValues = sourceOptions.value?.filter((item: any) => !isItemDisabled(item)).map((item: any) => getItemValue(item)) ?? []

  if (next === true) {
    const additions = allEnabledValues.filter((item: any) => !selectedItems.value?.some((val: any) => compareItems(val, item)))
    comboboxModel.value = [...selectedItems.value, ...additions]
  }
  else if (next === false) {
    const remaining = selectedItems.value?.filter((val: any) => !allEnabledValues.some((item: any) => compareItems(item, val)))
    comboboxModel.value = remaining
  }
  else {
    const additions = allEnabledValues.filter((item: any) => !selectedItems.value?.some((val: any) => compareItems(val, item)))
    comboboxModel.value = [...selectedItems.value, ...additions]
  }
}

// Remove the watch for sortedOptions since it's now computed automatically
defineExpose({ resetSelections })

// kept for potential external use; internal UI uses selectAllState
const _isAllSelected = computed(() => selectAllState.value === true)
</script>

<template>
  <Combobox
    v-model="comboboxModel"
    class="w-full"
    :multiple="multiple"
    :disabled="disabled"
    :by="comboboxBy"
    :open="open"
    :ignore-filter="!!asyncSearch"
    @update:open="onOpenChange"
  >
    <ComboboxAnchor class="w-full">
      <ComboboxTrigger as-child>
        <slot name="button" :selected-items="selectedItems" :placeholder="placeholder">
          <DsButton
            :data-cy="name"
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            class="justify-between text-primary flex items-center w-full rounded-sm border border-zinc-200 bg-white p-3 text-left text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            :class="triggerStyle"
          >
            <Icon v-if="icon" :name="icon" class="-mt-0.5 mr-1" />
            <template v-if="$slots.selected">
              <slot
                name="selected"
                :selected-items="selectedItems"
                :multiple="multiple"
                :label-key="labelKey"
                :placeholder="placeholder"
              />
            </template>
            <template v-else>
              <div>
                <span v-if="selectedItems.length">
                  {{ multiple ? `${selectedItems.length} item(s) selected` : getLabelForValue(selectedItems[0]) }}
                </span>
                <span v-else class="opacity-60">
                  {{ placeholder }}
                </span>
              </div>
            </template>
            <Icon name="lucide:chevrons-up-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </DsButton>
        </slot>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList class="w-full p-0 !z-[1000] border border-zinc-200 rounded-sm" :use-portal="usePortal">
      <div class="w-full border-b border-zinc-200 bg-white">
        <ComboboxInput
          v-model="searchTerm"
          :placeholder="searchPlaceholder"
          auto-focus
          data-cy="search-item"
        />
      </div>

      <div v-if="multiple && filteredOptions.length" class="flex items-center justify-end pt-2 pb-1 px-2 space-x-2">
        <label
          for="select-all"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
        >
          Select All
        </label>
        <Checkbox id="select-all" data-cy="select-all" :model-value="selectAllState" @update:model-value="onSelectAllChange" />
      </div>

      <!-- Consumer-provided extra header content (e.g., action buttons) -->
      <slot name="header-extra" v-bind="{ search: searchTerm }" />

      <!-- Loading state for async search -->
      <div v-if="isLoading" class="flex items-center justify-center py-3 text-sm text-muted-foreground">
        <Icon name="svg-spinners:270-ring" class="mr-2 h-4 w-4 shrink-0 opacity-70" />
        <span>{{ loadingText }}</span>
      </div>

      <ComboboxEmpty v-if="!isLoading">
        <slot name="empty" v-bind="{ search: searchTerm }">
          No items found.
        </slot>
      </ComboboxEmpty>

      <ComboboxGroup v-auto-animate class="w-screen max-w-sm max-h-72 overflow-y-auto">
        <ComboboxItem
          v-for="(item) in filteredOptions"
          :key="item?.[valueKey]"
          :value="getItemValue(item)"
          :text-value="getTextValue(item)"
          data-cy="item"
          class="cursor-pointer p-2.5 hover:bg-gray-100 text-sm text-primary rounded-sm"
          :class="{ 'opacity-50 cursor-not-allowed': isItemDisabled(item) }"
          :disabled="isItemDisabled(item)"
        >
          <slot name="item" v-bind="item">
            {{ item?.[labelKey] }}
          </slot>
          <div class="w-[20px]">
            <ComboboxItemIndicator>
              <Icon name="lucide:check" :class="cn('ml-auto h-4 w-4')" />
            </ComboboxItemIndicator>
          </div>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </Combobox>
</template>
