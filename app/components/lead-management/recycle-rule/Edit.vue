<script setup lang="ts">
import { Icon } from '#components'
import { useForm } from 'vee-validate'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  initialData: Record<string, any> | null
}>()

const open = defineModel<boolean>('open', { default: false })

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

// campaign list options
const { data: campaignList, status: campaignListStatus, refresh: campaignRefresh } = await useLazyAsyncData('campaigns', () =>
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

// Form Setup
const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  initialValues: {
    recycle_rule_id: props.initialData?.id ?? null,
    campaign_id: props.initialData?.campaign_id ?? null,
    list_id: props.initialData?.list_id ?? null,
    disposition_id: props.initialData?.disposition_id ?? null,
    day: props.initialData?.day ?? '',
    time: props.initialData?.time ?? '',
    call_time: props.initialData?.call_time ?? null,
  },
})

// Submit Handler
const onSubmit = handleSubmit(async (values) => {
  const payload = {
    recycle_rule_id: values.recycle_rule_id,
    campaign_id: values.campaign_id,
    list_id: values.list_id,
    disposition_id: values.disposition_id,
    day: values.day,
    time: values.time?.slice(0, 5), // Format HH:mm:ss to HH:mm
    call_time: Number(values.call_time),
    is_deleted: 0,
  }

  try {
    const response = await useApi().post('/edit-recycle-rule', {
      ...payload,
    })

    if (response.success === 'true') {
      showToast({
        message: response.message,
        type: 'success',
      })
      resetForm()
      open.value = false
      refreshNuxtData('recycle-rule')
    }
    else {
      showToast({
        message: response.message,
        type: 'error',
      })
    }
  }
  catch (error) {
    showToast({
      message: `${error}`,
      type: 'error',
    })
  }
})

watch(open, async (newVal) => {
  if (newVal) {
    await Promise.all([
      campaignRefresh(),
      leadListRefresh(),
      dispositionRefresh(),
    ])
    // Set initial values
    if (props.initialData) {
      setFieldValue('campaign_id', props.initialData.campaign_id)
      setFieldValue('list_id', props.initialData.list_id)
      setFieldValue('disposition_id', props.initialData.disposition_id)
      setFieldValue('day', props.initialData.day)
      setFieldValue('time', props.initialData.time)
      setFieldValue('call_time', props.initialData.call_time)
      resetForm({
        values: {
          recycle_rule_id: props.initialData.id,
          campaign_id: props.initialData.campaign_id,
          list_id: props.initialData.list_id,
          disposition_id: props.initialData.disposition_id,
          day: props.initialData.day,
          time: props.initialData.time,
          call_time: props.initialData.call_time,
        },
      })
    }
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
            name="campaign_id"
          >
            <FormItem>
              <FormLabel>Campaign</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="campaignListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
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
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="leadListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in leadList" :key="option.list_id" :value="option.list_id">
                        {{ option.list }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="disposition_id">
            <FormItem>
              <FormLabel>Disposition</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-if="dispositionListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
                      <Icon name="eos-icons:loading" />
                    </SelectItem>
                    <template v-else>
                      <SelectItem v-for="option in dispositionList" :key="option.id" :value="option.id">
                        {{ option.title }}
                      </SelectItem>
                    </template>
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
                <Select v-bind="componentField">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="option in dayOptions" :key="option.day" :value="option.day" class="capitalize">
                      {{ option.day }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="call_time">
            <FormItem>
              <FormLabel>Call Time</FormLabel>
              <FormControl>
                <Select v-bind="componentField">
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
            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="time">
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
            <Icon name="material-symbols:close" size="20" class="mr-1" />
            Close
          </Button>
          <Button type="submit" class="w-[50%]" :loading="isSubmitting" :disabled="isSubmitting">
            <Icon name="material-symbols:save" size="20" class="mr-1" />
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
