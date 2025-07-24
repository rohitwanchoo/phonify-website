<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

// Define emits
const emit = defineEmits<{
  applyFilter: []
  clearFilter: []
}>()

const { data: serverOptions } = useNuxtData('server-option-list')

// Sheet open state
const open = ref(false)
const formValues = defineModel<Record<string, any>>('formValues', {
  default: {
    whitelistIp: '',
    asteriskServer: '',
    status: '',
    fromWeb: '',
  },
})

// Dummy data for dropdown options
// const serverOptions = [
//   { label: 'All', value: 'null' },
// ]

const statusOptions = [
  { value: '0', label: 'Pending' },
  { value: '1', label: 'Approved' },
  { value: '-1', label: 'Rejected' },
]

const fromWebOptions = [
  { label: 'All', value: null },
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
]

// Form validation schema

// const filterValues = defineModel({default :{
//   whitelistIp: '',
//   server: '',
//   status: '',
//   fromWeb: '',
// } })

// Submit handler
function onSubmit() {
  // Build filter parameters object with only filled values

  emit('applyFilter')
  open.value = false
}

// const formValues = ref({
//   whitelistIp: '',
//   server: '',
//   status: '',
//   fromWeb: '',
// })

// Clear filters
function clearFilters() {
  emit('clearFilter')
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="!text-primary" @click="open = true">
    <Icon name="material-symbols:sort" class="!text-primary" />
    Filter
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Filter Ip Approval List
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto space-y-6">
          <div class="flex-1 overflow-y-auto">
            <div class="mx-auto p-6 space-y-6">
              <div class="space-y-4">
                <!-- IP Address Field -->
                <div>
                  <label class="text-sm font-medium text-primary">IP Address</label>
                  <Input
                    v-model="formValues.whitelistIp"
                    type="text"
                    class="h-11"
                    placeholder="Enter IP address"
                  />
                </div>

                <!-- Server Dropdown -->
                <div>
                  <label class="text-sm font-medium text-primary">Server</label>
                  <Select v-model="formValues.asteriskServer">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-black" placeholder="Select server" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem :value="null">
                        All
                      </SelectItem>
                      <SelectItem
                        v-for="option in serverOptions"
                        :key="option.id"
                        :value="option.host"
                      >
                        {{ option.host }} - {{ option.location }} - {{ option.trunk }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- Status Dropdown -->
                <div>
                  <label class="text-sm font-medium text-primary">Status</label>
                  <Select v-model="formValues.status">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <!-- From Web Dropdown -->
                <div>
                  <label class="text-sm font-medium text-primary">From Web</label>
                  <Select v-model="formValues.fromWeb">
                    <SelectTrigger class="w-full !h-11">
                      <SelectValue class="text-black" placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="option in fromWebOptions"
                        :key="option.label"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky footer with buttons -->
      <div class="p-6 bg-white flex gap-x-2">
        <Button variant="outline" class="w-1/2 h-12 text-md" @click="clearFilters">
          <Icon name="material-symbols:close" class="text-md" />
          Clear
        </Button>
        <Button class="w-1/2 h-12 text-md" @click="onSubmit">
          <Icon name="material-symbols:search" class="text-md" />
          Search
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
