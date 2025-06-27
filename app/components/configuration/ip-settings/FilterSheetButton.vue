<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'

// Define emits
const emit = defineEmits<{
  applyFilter: [filterParams: Record<string, any>]
  clearFilter: []
}>()

// Sheet open state
const open = defineModel<boolean>('open', { default: false })

// Dummy data for dropdown options
const serverOptions = [
  { label: 'US East Server', value: 'us-east' },
  { label: 'US West Server', value: 'us-west' },
  { label: 'Europe Server', value: 'eu' },
  { label: 'Asia Server', value: 'asia' },
]

const statusOptions = [
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Under Review', value: 'under_review' },
]

const fromWebOptions = [
  { label: 'Website Form', value: 'website' },
  { label: 'API Submission', value: 'api' },
  { label: 'Admin Panel', value: 'admin' },
  { label: 'Mobile App', value: 'mobile' },
]

// Form validation schema
const formSchema = toTypedSchema(
  z.object({
    ipAddress: z.string().optional(),
    server: z.string().optional(),
    status: z.string().optional(),
    fromWeb: z.string().optional(),
  }),
)

// Form setup
const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
})

// Submit handler
const onSubmit = handleSubmit((values) => {
  // Build filter parameters object with only filled values
  const filterParams: Record<string, any> = {}

  if (values.ipAddress)
    filterParams.ipAddress = values.ipAddress
  if (values.server)
    filterParams.server = values.server
  if (values.status)
    filterParams.status = values.status
  if (values.fromWeb)
    filterParams.fromWeb = values.fromWeb

  emit('applyFilter', filterParams)
  open.value = false
})

// Clear filters
function clearFilters() {
  resetForm()
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
    <SheetContent class="md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
          Filter Ip Approval List
        </SheetTitle>
      </SheetHeader>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto">
        <div class="mx-auto p-6 space-y-6">
          <form id="filterForm" class="space-y-4">
            <!-- IP Address Field -->
            <FormField v-slot="{ componentField }" name="ipAddress">
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter IP address"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Server Dropdown -->
            <FormField v-slot="{ componentField }" name="server">
              <FormItem>
                <FormLabel>Server</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select server" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="option in serverOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- Status Dropdown -->
            <FormField v-slot="{ componentField }" name="status">
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
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
                <FormMessage />
              </FormItem>
            </FormField>

            <!-- From Web Dropdown -->
            <FormField v-slot="{ componentField }" name="fromWeb">
              <FormItem>
                <FormLabel>From Web</FormLabel>
                <Select v-bind="componentField">
                  <FormControl>
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      v-for="option in fromWebOptions"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormField>
          </form>
        </div>
      </div>

      <!-- Sticky footer with buttons -->
      <div class="p-6 bg-white space-y-3">
        <Button type="submit" form="filterForm" class="w-full h-12 text-md" @click="onSubmit">
          <Icon name="material-symbols:search" class="text-md" />
          Search
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
