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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'

const open = defineModel<boolean>('open', { default: false })

// campaign list options
const campaignList = await useApi().get('campaigns')
const campaignOptions = computed(() => campaignList.data?.map((e: { title: string, id: number }) => ({
  label: e.title,
  campaignId: e.id,
})))

// lead management list options
const leadList = await useApi().post('list')
const listOptions = computed(() => leadList.data?.map((e: { list: string, list_id: number }) => ({
  label: e.list,
  listId: e.list_id,
})))

// disposition options
const dipositionList = await useApi().post('disposition')
const dispositionOptions = computed(() => dipositionList.data?.map((e: { title: string, id: number }) => ({
  label: e.title,
  dispositionValue: e.id,
})))

// day options
const dayOptions = [
  { label: 'Monday', day: 'monday' },
  { label: 'Tuesday', day: 'tuesday' },
  { label: 'Wednesday', day: 'wednesday' },
  { label: 'Thursday', day: 'thursday' },
  { label: 'Friday', day: 'friday' },
  { label: 'Saturday', day: 'saturday' },
  { label: 'Sunday', day: 'sunday' },
]

// call time options
const callTimeOptions = [
  { label: '≤ 2', callTime: 2 },
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
})

const selectedDays = ref<string[]>([])
const daySelectTemp = ref('')

const loading = ref(false)

const availableDayOptions = computed(() => dayOptions.filter(opt => !selectedDays.value.includes(opt.day)))

const onSubmit = handleSubmit(async (values) => {
  const payload = {
    campaign_id: values.campaign,
    list_id: values.list,
    disposition: [values.disposition],
    day: values.day,
    time: values.fromTime, // or `${values.fromTime}-${values.toTime}`
    call_time: Number(values.callTime),
  }

  try {
    loading.value = true
    const response = await useApi().post('/add-recycle-rule', {
      ...payload,
    })
    showToast({
      message: response.message,
      type: response.success ? 'success' : 'error',
    })
    resetForm()
    open.value = false
    loading.value = false
  }
  catch (error) {
    showToast({
      message: `${error}`,
      type: 'error',
    })
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button>
        <Icon class="!text-white" name="lucide:plus" />
        Add Recyle Rule
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Add Recycle Rule</DialogTitle>
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
                            <Icon name="material-symbols:close" size="12" />
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
          <Button type="submit" class="w-[50%]" :loading="loading" :disabled="loading">
            <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
