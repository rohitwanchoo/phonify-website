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

const props = defineProps<{
  initialData?: Record<string, any> | null
  isEdit?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

// campaign list options
const { data: campaignList, status: campaignStatus, refresh: campaignRefresh } = await useLazyAsyncData('campaigns', () =>
  useApi().get('/campaigns'), {
  transform: res => res.data,
  immediate: false,
})

// lead management list options
const { data: leadList, status: leadListStatus, refresh: leadListRefresh } = await useLazyAsyncData('list', () =>
  useApi().post('/list'), {
  transform: res => res.data,
  immediate: false,
})

// disposition options
const { data: dispositionList, status: dispositionListStatus, refresh: dispositionRefresh } = await useLazyAsyncData('disposition', () =>
  useApi().post('/disposition'), {
  transform: res => res.data,
  immediate: false,
})

const dispositionOpen = ref(false)
const dayOpen = ref(false)

// watch for open state changes to close other select
watch([dispositionOpen, dayOpen], ([newDisposition, newDay], [oldDisposition, oldDay]) => {
  if (newDisposition && newDisposition !== oldDisposition)
    dayOpen.value = false
  if (newDay && newDay !== oldDay)
    dispositionOpen.value = false
})

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
  { value: 2, label: 'less than or equal to 2' },
  { value: 3, label: 'less than or equal to 3' },
  { value: 4, label: 'less than or equal to 4' },
  { value: 5, label: 'less than or equal to 5' },
  { value: 6, label: 'less than or equal to 6' },
  { value: 7, label: 'less than or equal to 7' },
  { value: 8, label: 'less than or equal to 8' },
  { value: 9, label: 'less than or equal to 9' },
  { value: 10, label: 'less than or equal to 10' },
  { value: 11, label: 'less than or equal to 11' },
  { value: 12, label: 'less than or equal to 12' },
  { value: 13, label: 'less than or equal to 13' },
  { value: 14, label: 'less than or equal to 14' },
  { value: 15, label: 'less than or equal to 15' },
]

const loading = ref(false)

// Dynamic schema based on edit mode
const formSchema = computed(() => toTypedSchema(z.object({
  campaign_id: z.number().min(1, 'Campaign is required'),
  list_id: z.number().min(1, 'List is required'),
  disposition_id: props.isEdit
    ? z.number().min(1, 'Disposition is required')
    : z.array(z.number()).min(1, 'Disposition is required'),
  days: props.isEdit
    ? z.string().min(1, 'Day is required')
    : z.array(z.string()).min(1, 'At least one day is required'),
  call_time: z.number().min(1, 'Call Time is required'),
  time: z.string().min(1, 'From time is required'),
})))

const { handleSubmit, resetForm, setValues, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    campaign_id: props.initialData?.campaign_id,
    list_id: props.initialData?.list_id,
    disposition_id: props.isEdit ? undefined : [],
    days: props.isEdit ? '' : [],
    call_time: props.initialData?.call_time || 2,
    time: props.initialData?.time || '',
  },
})

watch(() => open.value, (newVal) => {
  // Only fetch data if it hasn't been loaded yet
  if (!campaignList.value)
    campaignRefresh()
  if (!leadList.value)
    leadListRefresh()
  if (!dispositionList.value)
    dispositionRefresh()

  if (newVal && props.isEdit) {
    setValues({
      ...props.initialData,
      disposition_id: props.initialData?.disposition_id,
      days: Array.isArray(props.initialData?.days) ? props.initialData.days[0] : props.initialData?.days,
    })
  }
  else {
    resetForm({
      values: {
        campaign_id: undefined,
        list_id: undefined,
        disposition_id: props.isEdit ? undefined : [],
        days: props.isEdit ? '' : [],
        call_time: 2,
        time: '',
      },
    })
  }
})

const availableDayOptions = computed(() => {
  if (props.isEdit)
    return dayOptions
  return dayOptions.filter(opt => !values?.days?.includes(opt.day))
})

const availableDispositionOptions = computed(() => {
  if (props.isEdit)
    return dispositionList.value || []
  return (dispositionList.value || []).filter((opt: any) =>
    Array.isArray(values?.disposition_id) && !values.disposition_id.includes(opt.id),
  )
})

const onSubmit = handleSubmit(async (values) => {
  let payload = {}
  if (!props.isEdit) {
    payload = {
      campaign_id: values.campaign_id,
      list_id: values.list_id,
      disposition: values.disposition_id,
      day: values.days,
      time: values.time,
      call_time: Number(values.call_time),
    }
  }
  else {
    payload = {
      recycle_rule_id: props.initialData?.id,
      campaign_id: values.campaign_id,
      list_id: values.list_id,
      disposition_id: Number(values.disposition_id),
      day: String(values.days),
      time: values.time?.slice(0, 5), // Format HH:mm:ss to HH:mm
      call_time: Number(values.call_time),
      is_deleted: 0,
    }
  }

  const api = props.isEdit ? '/edit-recycle-rule' : '/add-recycle-rule'

  try {
    loading.value = true
    const response = await useApi().post(api, {
      ...payload,
    })
    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      loading.value = false
      refreshNuxtData('recycle-rule')
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: `${error.message}`,
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
      <Button class="h-11">
        <Icon class="!text-white" name="material-symbols:add" size="20" />
        Add Recycle Rule
      </Button>
    </DialogTrigger>
    <DialogContent class="max-h-[90vh] h-fit overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {{ props.isEdit ? 'Edit' : 'Add' }} Recycle Rule
        </DialogTitle>
      </DialogHeader>
      <Separator />
      <form id="form" @submit="onSubmit">
        <div class="space-y-4">
          <FormField
            v-slot="{ componentField }"
            name="campaign_id"
          >
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="campaignStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in campaignList" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="list_id">
            <FormItem>
              <FormLabel>List</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="leadListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in leadList" :key="option.list_id" :value="option.list_id" class="sm:max-w-[442px]">
                        {{ option.list }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Disposition field - single select in edit mode, multi-select in add mode -->
          <FormField v-if="props.isEdit" v-slot="{ componentField }" name="disposition_id">
            <FormItem>
              <FormLabel>Select disposition</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="dispositionListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in availableDispositionOptions" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-else v-slot="{ componentField, value }" name="disposition_id">
            <FormItem>
              <FormLabel>Select disposition</FormLabel>
              <FormControl>
                <div class="relative">
                  <Select
                    v-model:open="dispositionOpen"
                    v-bind="componentField"
                    multiple
                  >
                    <SelectTrigger class="w-full flex items-center relative !min-h-11 py-2 !h-auto">
                      <span v-if="!value.length" class="text-muted-foreground">Select disposition</span>
                      <div
                        v-if="value.length"
                        class="flex flex-wrap gap-1 items-center w-full pointer-events-auto"
                        style="min-height: 1.5rem;"
                      >
                        <div
                          v-for="item in value"
                          :key="item"
                          class="flex items-center rounded-[6px] border border-[#00A086] bg-[#00A0861A] px-2 py-1 text-xs h-7 flex-shrink-0"
                        >
                          {{ (dispositionList || []).find((opt: any) => opt.id === item)?.title || '' }}
                          <Button
                            type="menu"
                            variant="outline"
                            class="ml-1 p-0 h-fit bg-accent"
                            @click.stop="value.splice(value.indexOf(item), 1)"
                          >
                            <Icon name="material-symbols:close" size="12" />
                          </Button>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-if="dispositionListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                        <Icon name="eos-icons:loading" />
                      </SelectItem>
                      <template v-else>
                        <SelectItem v-for="option in availableDispositionOptions" :key="option.id" :value="option.id">
                          {{ option.title }}
                        </SelectItem>
                      </template>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Day field - single select in edit mode, multi-select in add mode -->
          <FormField v-if="props.isEdit" v-slot="{ componentField }" name="days">
            <FormItem>
              <FormLabel>Select Day</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in availableDayOptions" :key="option.day" :value="option.day">
                      {{ option.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-else v-slot="{ componentField, value }" name="days">
            <FormItem>
              <FormLabel>Select Day</FormLabel>
              <FormControl>
                <div class="relative">
                  <Select
                    v-model:open="dayOpen"
                    v-bind="componentField"
                    multiple
                  >
                    <SelectTrigger class="w-full flex items-center relative !min-h-11 py-2 !h-auto">
                      <span v-if="!value.length" class="text-muted-foreground">Select day</span>
                      <div
                        v-if="value.length"
                        class="flex flex-wrap gap-1 items-center w-full pointer-events-auto"
                        style="min-height: 1.5rem;"
                      >
                        <div
                          v-for="item in value"
                          :key="item"
                          class="flex items-center rounded-[6px] border border-[#00A086] bg-[#00A0861A] px-2 py-1 text-xs h-7 flex-shrink-0"
                        >
                          {{ dayOptions.find(opt => opt.day === item)?.label || item }}
                          <Button
                            variant="outline"
                            class="ml-1 p-0 h-fit bg-accent"
                            @click.stop="value.splice(value.indexOf(item), 1)"
                          >
                            <Icon name="material-symbols:close" size="12" />
                          </Button>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="option in availableDayOptions" :key="option.day" :value="option.day">
                        {{ option.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="call_time">
            <FormItem>
              <FormLabel>Call Time</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full !h-11">
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
          <FormField v-slot="{ componentField }" name="time">
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input v-bind="componentField" type="time" class="shadow-none ml-auto w-full h-11 focus-visible:ring-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button class="w-[50%] text-primary h-11" variant="outline" @click="open = false">
            <Icon name="material-symbols:close" size="20" class="mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%] h-11" :loading="loading" :disabled="loading">
            <Icon name="material-symbols:save" size="20" class="mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
