<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { CalendarIcon } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { Calendar } from '@/components/ui/calendar'
// Define emits
const emit = defineEmits<{
  applyFilter: []
  clearFilter: []
}>()

// Sheet open state
const open = ref(false)
const formValues = defineModel<Record<string, any>>('formValues', {
  default: {
    whitelistIp: '',
    server: '',
    status: '',
    fromWeb: '',
  },
})

// Dummy data for dropdown options
const serverOptions = [
  { label: 'All', value: 'null' },
]

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
  resetForm()
  emit('clearFilter')
  open.value = false
}
</script>

<template>
  <Button variant="outline" class="!text-white bg-black hover:bg-black" @click="open = true">
    <Icon name="material-symbols-light:contact-phone" class="!text-white text-xl" />
     Manually Call for CNAM
  </Button>

  <Sheet v-model:open="open">
    <SheetContent class="w-full md:min-w-[483px] flex flex-col h-full">
      <SheetHeader class="bg-[#162D3A]">
        <SheetTitle class="text-white">
            Manually Call for CNAM
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
                  <label class="text-sm font-medium text-primary">Phone Number</label>
                  <Input
                    type="number"
                    class="h-11"
                    placeholder="Enter Phone Number"
                  />
                </div>



        
              </div>
            </div>
          </div>
        </div>
      </div>

      

      <!-- Sticky footer with buttons -->
      <div class="p-6 bg-white space-y-2 flex gap-2 ">
        
        <Button variant="outline" class="w-[49%] h-12 text-md text-primary border-primary" @click="onSubmit">
          <Icon name="material-symbols:close" class="text-md" />
          Close
        </Button>
        <Button class="w-[49%] h-12 text-md" @click="onSubmit">
          <Icon name="material-symbols:bolt" class="text-md" />
          Run
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
