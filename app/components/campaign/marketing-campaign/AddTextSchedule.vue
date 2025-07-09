<!-- components/AddTextSchedule.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{ rowData?: any }>()
const open = defineModel('open', { type: Boolean, default: false })

// Options
const countryCodes = [
  { value: 'US', label: '+1 (US)' },
  { value: 'IN', label: '+91 (IN)' },
  { value: 'UK', label: '+44 (UK)' },
]
const lists = [
  { value: 'list1', label: 'List 1' },
  { value: 'list2', label: 'List 2' },
]
const templates = [
  { value: 'template1', label: 'Template 1' },
  { value: 'template2', label: 'Template 2' },
]
const dids = [
  { value: 'did1', label: 'DID 1' },
  { value: 'did2', label: 'DID 2' },
]

// Fields
const selectedCountry = ref('')
const selectedList = ref('')
const selectedTemplate = ref('')
const selectedDid = ref('')
const runDate = ref('')
const runTime = ref('')

// Reset on open change
function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    resetFields()
  }
  open.value = isOpen
}

// Reset form fields
function resetFields() {
  selectedCountry.value = ''
  selectedList.value = ''
  selectedTemplate.value = ''
  selectedDid.value = ''
  runDate.value = ''
  runTime.value = ''
}

// Preload when rowData changes
watch(
  () => props.rowData,
  (val) => {
    if (val) {
      // You can prefill the form if needed
    }
  },
  { immediate: true },
)

// Submit
function handleSave() {
  // Perform API logic here
  open.value = false
}
</script>

<template>
  <Dialog :open="open" @update:open="onOpenChange">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Text Schedule</DialogTitle>
      </DialogHeader>
      <form class="space-y-4" @submit.prevent="handleSave">
        <!-- Country Code -->
        <FormField>
          <FormItem>
            <FormLabel>Country Code</FormLabel>
            <Select v-model="selectedCountry">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select country code" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in countryCodes"
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

        <!-- Select List -->
        <FormField>
          <FormItem>
            <FormLabel>Select List</FormLabel>
            <Select v-model="selectedList">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select list" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in lists"
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

        <!-- Text Template -->
        <FormField>
          <FormItem>
            <FormLabel>Text Template</FormLabel>
            <Select v-model="selectedTemplate">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in templates"
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

        <!-- DID -->
        <FormField>
          <FormItem>
            <FormLabel>DID</FormLabel>
            <Select v-model="selectedDid">
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select DID" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  v-for="option in dids"
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

        <!-- Run Date & Time -->
        <div>
          <FormLabel>Run Time</FormLabel>
          <div class="flex gap-2">
            <!-- Date -->
            <FormField>
              <FormItem class="flex-1">
                <FormControl>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        class="w-full justify-start text-left font-normal"
                        :class="!runDate && 'text-muted-foreground'"
                      >
                        <Icon name="lucide:calendar" class="mr-2 h-4 w-4" />
                        {{ runDate ? new Date(runDate).toLocaleDateString() : 'Select date' }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="runDate" />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormItem>
            </FormField>

            <!-- Time -->
            <FormField>
              <FormItem class="flex-1">
                <FormControl>
                  <Input v-model="runTime" type="time" class="w-full" />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </div>

        <!-- Footer -->
        <DialogFooter class="w-full mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            class="flex-1 h-11"
            @click="onOpenChange(false)"
          >
            <Icon name="material-symbols:close" size="20" />
            Close
          </Button>
          <Button
            type="submit"
            class="flex-1 h-11"
          >
            <Icon name="material-symbols:save" size="20" />
            Save
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
