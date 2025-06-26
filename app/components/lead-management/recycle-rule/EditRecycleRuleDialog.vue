<script setup lang="ts">
import { Icon } from '#components'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const open = defineModel<boolean>('open', { default: false })

const campaignOptions = [
  { label: 'Campaign 1', campaignId: 101 },
  { label: 'Campaign 2', campaignId: 2 },
  { label: 'Campaign 3', campaignId: 3 },
]
const listOptions = [
  { label: 'List 1', listId: 202 },
  { label: 'List 2', listId: 2 },
  { label: 'List 3', listId: 3 },
]
const dispositionOptions = [
  { label: 'Sale', dispositionValue: 5 },
  { label: 'No Answer', dispositionValue: 2 },
  { label: 'Callback', dispositionValue: 3 },
]
const dayOptions = [
  { label: 'Monday', day: 'monday' },
  { label: 'Tuesday', day: 'tuesday' },
  { label: 'Wednesday', day: 'wednesday' },
  { label: 'Thursday', day: 'thursday' },
  { label: 'Friday', day: 'friday' },
  { label: 'Saturday', day: 'saturday' },
  { label: 'Sunday', day: 'sunday' },
]
const callTimeOptions = [
  { label: '≤ 2', callTime: 600 },
  { label: '≤ 3', callTime: 3 },
  { label: '≤ 4', callTime: 4 },
]

const formSchema = toTypedSchema(z.object({
  campaign: z.number().min(1, 'Campaign is required'),
  list: z.number().min(1, 'List is required'),
  disposition: z.number().min(1, 'Disposition is required'),
  day: z.array(z.string()).min(1, 'At least one day is required'),
  callTime: z.number().min(1, 'Call Time is required'),
  fromTime: z.string().min(1, 'From time is required'),
  toTime: z.string().min(1, 'To time is required'),
}))

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
    initialValues: {
    campaign: 101,
    list: 202,
    disposition: 5,
    day: ['tuesday'],
    callTime: 600,
    fromTime: '09:00',
    toTime: '17:00',
  },
})

const selectedDays = ref<string[]>([])
const daySelectTemp = ref('')

const availableDayOptions = computed(() => dayOptions.filter(opt => !selectedDays.value.includes(opt.day)))

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    recycle_rule_id: 1,
    campaign_id: values.campaign,
    list_id: values.list,
    disposition: values.disposition,
    day: values.day,
    time: values.fromTime, // or `${values.fromTime}-${values.toTime}`
    call_time: Number(values.callTime),
    is_deleted: 0
  }

  try {
    const response = await useApi().post('/edit-recycle-rule', {
      ...payload,
    })
    showToast({
      message: response.value.message,
      type: response.value.success,
    })
    resetForm()
    open.value = false
  }
  catch (error) {
    showToast({
      message: `${error}`,
      type: 'error',
    })
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Recycle Rule</DialogTitle>
      </DialogHeader>
      <Separator class="my-1" />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="campaign"
          >
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in campaignOptions" :key="option.campaignId" :value="option.campaignId">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="list">
            <FormItem>
              <FormLabel>List</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in listOptions" :key="option.listId" :value="option.listId">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="disposition">
            <FormItem>
              <FormLabel>Disposition</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in dispositionOptions" :key="option.dispositionValue" :value="option.dispositionValue">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="day">
            <FormItem>
              <FormLabel>Select Day</FormLabel>
              <FormControl>
                <div class="relative">
                  <!-- Dropdown for selecting days -->
                  <Select
                    v-bind="componentField"
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
                          {{ dayOptions.find(opt => opt.day === item)?.label || item }}
                          <Button
                            variant="outline"
                            class="ml-1 p-0 h-fit bg-accent"
                            @click.stop="selectedDays.splice(selectedDays.indexOf(item), 1)"
                          >
                            <Icon name="lucide:x" size="12" />
                          </Button>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in availableDayOptions" :key="option.day" :value="[option.day]">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="callTime">
            <FormItem>
              <FormLabel>Call Time</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select call time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in callTimeOptions" :key="option.callTime" :value="option.callTime">
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
            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="fromTime">
                <FormItem class="flex flex-col flex-1">
                  <FormControl>
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        From:
                      </div>

                      <Input v-bind="componentField" type="time" class="border-none shadow-none ml-auto w-28 " />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="toTime">
                <FormItem class="flex flex-col flex-1">
                  <FormControl>
                    <div class="flex items-center justify-between border border-gray-300 rounded-md px-2">
                      <div class="text-sm text-muted-foreground">
                        To:
                      </div>

                      <Input v-bind="componentField" type="time" class="border-none shadow-none ml-auto w-28 " />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="w-[50%] text-primary" variant="outline" @click="open = false">
            <Icon name="lucide:x" class="w-4 h-4 mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%]">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
