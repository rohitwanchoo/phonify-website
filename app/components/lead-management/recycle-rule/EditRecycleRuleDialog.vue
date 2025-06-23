<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { Clock } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const open = defineModel<boolean>('open', { default: false })

const campaignOptions = [
  { label: 'Campaign 1', value: 'campaign1' },
  { label: 'Campaign 2', value: 'campaign2' },
  { label: 'Campaign 3', value: 'campaign3' },
]
const listOptions = [
  { label: 'List 1', value: 'list1' },
  { label: 'List 2', value: 'list2' },
  { label: 'List 3', value: 'list3' },
]
const dispositionOptions = [
  { label: 'Sale', value: 'sale' },
  { label: 'No Answer', value: 'no_answer' },
  { label: 'Callback', value: 'callback' },
]
const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]
const callTimeOptions = [
  { label: '≤ 2', value: '2' },
  { label: '≤ 3', value: '3' },
  { label: '≤ 4', value: '4' },
]

const formSchema = z.object({
  campaign: z.string().min(1, 'Campaign is required'),
  list: z.string().min(1, 'List is required'),
  disposition: z.string().min(1, 'Disposition is required'),
  day: z.array(z.string()).min(1, 'At least one day is required'),
  callTime: z.string().min(1, 'Call Time is required'),
  fromTime: z.string().min(1, 'From time is required'),
  toTime: z.string().min(1, 'To time is required'),
})

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    campaign: '',
    list: '',
    disposition: '',
    day: [],
    callTime: '',
    fromTime: '',
    toTime: '',
  },
})

const selectedDays = ref<string[]>([])
const daySelectTemp = ref('')

const availableDayOptions = computed(() => dayOptions.filter(opt => !selectedDays.value.includes(opt.value)))

watch(selectedDays, (val) => {
  form.values.day = val ?? []
})
watch(() => form.values.day, (val) => {
  if (JSON.stringify(val ?? []) !== JSON.stringify(selectedDays.value)) {
    selectedDays.value = val ?? []
  }
})

function onSubmit(_values: any) {
  // handle submit
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Recycle Rule</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <Form :form="form" @submit.prevent="onSubmit">
        <div class="space-y-4">
          <FormField name="campaign">
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-model="form.values.campaign">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in campaignOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="list">
            <FormItem>
              <FormLabel>List</FormLabel>
              <FormControl>
                <Select v-model="form.values.list">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in listOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="disposition">
            <FormItem>
              <FormLabel>Disposition</FormLabel>
              <FormControl>
                <Select v-model="form.values.disposition">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in dispositionOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="day">
            <FormItem>
              <FormLabel>Select Day</FormLabel>
              <FormControl>
                <div class="relative">
                  <Select
                    v-model="daySelectTemp"
                    @update:model-value="(val) => {
                      const v = String(val)
                      if (v && !selectedDays.includes(v)) {
                        selectedDays.push(v)
                        daySelectTemp = ''
                      }
                    }"
                  >
                    <SelectTrigger class="w-full flex items-start relative !min-h-10 py-2 !h-auto">
                      <span v-if="!selectedDays.length" class="text-muted-foreground">Select day</span>
                      <div
                        v-if="selectedDays.length"
                        class="flex flex-wrap gap-1 items-center w-full pointer-events-auto"
                        style="min-height: 1.5rem;"
                      >
                        <div
                          v-for="item in selectedDays"
                          :key="item"
                          class="flex items-center rounded-[6px] border border-[#00A086] bg-[#00A0861A] px-2 py-1 text-xs h-7 flex-shrink-0"
                        >
                          {{ dayOptions.find(opt => opt.value === item)?.label || item }}
                          <button
                            type="button"
                            class="ml-1"
                            @click.stop="selectedDays.splice(selectedDays.indexOf(item), 1)"
                          >
                            <Icon name="lucide:x" class="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in availableDayOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField name="callTime">
            <FormItem>
              <FormLabel>Call Time</FormLabel>
              <FormControl>
                <Select v-model="form.values.callTime">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select call time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in callTimeOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <div>
            <div class="font-medium text-sm mb-1">
              Time
            </div>
            <div class="flex flex-wrap gap-4">
              <FormField name="fromTime">
                <FormItem class="flex-1">
                  <FormControl>
                    <div
                      class="flex items-center justify-between border border-gray-300 rounded-md px-2"
                    >
                      <div class="text-sm text-muted-foreground">
                        From:
                      </div>
                      <Input v-model="form.values.fromTime" type="time" class="border-none shadow-none ml-auto w-28" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField name="toTime">
                <FormItem class="flex-1">
                  <FormControl>
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        To:
                      </div>
                      <Input v-model="form.values.toTime" type="time" class="border-none shadow-none ml-auto w-28" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button type="button" class="w-[50%] text-primary" variant="outline" @click="open = false">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%]">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </Form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
