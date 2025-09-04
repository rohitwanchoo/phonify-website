<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import { ref } from 'vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  FormControl,
  FormField,
  FormItem,

} from '@/components/ui/form'

import { Button } from '~/components/ui/button'

import { Switch } from '~/components/ui/switch'

const props = defineProps<{
  values: any
  isPreview: boolean
  loading: boolean
}>()

const emits = defineEmits(['cancelEdit'])

const { enableEditSection } = useCreateCampaign()

const route = useRoute()

const id = route.query.id

const isEdit = computed(() => !!id)

const accordion = ref('')
const accordion2 = ref('')
const formState = useState<Campaign>('create-campaign-state')

watch(() => formState.value?.time_based_calling, (newVal) => {
  if (newVal && isEdit.value) {
    accordion.value = 'item-1'
  }
})

// call timing list
const { data: callTimingList, status: callTimingListStatus, refresh: callTimingListRefresh } = await useLazyAsyncData('get-call-timings-campaign', () =>
  useApi().get('/call-timers', {
  }), {
  transform: (res) => {
    return res.data.data
  },
  immediate: false,
})

function onEnableTimeBasedCalling(val: boolean) {
  if (val)
    accordion.value = 'item-1'
  else
    accordion.value = ''
  if (val && !callTimingList.value?.length) {
    callTimingListRefresh()
  }
}

interface CallTimingList {
  id: number
  title: string
  description: string
  week_plan: Partial<Record<string, { start: string, end: string }>>
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}
const selectedRowData = ref<CallTimingList>()
const callTimeSheet = ref<boolean>(false)
function onSelectCallTime() {
  accordion2.value = ''
}

const scheduleTitle = computed(() => {
  return callTimingList.value?.find((item: any) => item.id === formState.value.call_schedule_id)?.title
})
const enableEdit = computed(() => enableEditSection.value === 'time-based-calling' || !props.isPreview)

function cancelEdit() {
  enableEditSection.value = ''
  emits('cancelEdit')
}

function onEdit() {
  accordion2.value = 'item-2'
  enableEditSection.value = 'time-based-calling'
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class=" ">
      <Accordion v-model="accordion" collapsible>
        <AccordionItem value="item-1" class="">
          <div class="flex items-center justify-between px-5 h-[57px]" :class="accordion === 'item-1' && 'border-b'">
            <div class="text-[16px] font-medium text-primary/100">
              Time Based Calling
            </div>
            <div class="flex items-center gap-x-2">
              <div>
                <FormField v-if="enableEditSection === 'time-based-calling'" v-slot="{ value, handleChange }" v-model="formState.time_based_calling" name="time_based_calling">
                  <FormItem class="flex flex-row items-center justify-between">
                    <FormControl>
                      <Switch
                        class="data-[state=checked]:bg-green-600"
                        :model-value="value"
                        @update:model-value="(val: any) => {
                          handleChange(val);
                          onEnableTimeBasedCalling(val);
                        }"
                      />
                    </FormControl>
                  </FormItem>
                </FormField>
              </div>
              <div v-if="isPreview">
                <div v-if="enableEditSection === 'time-based-calling'" class="flex gap-x-2">
                  <Button variant="outline" size="sm" class="rounded" @click="cancelEdit">
                    <Icon name="lucide:x" />
                    Cancel
                  </Button>
                  <Button type="submit" class="w-[105px] rounded" size="sm" :disabled="loading">
                    <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
                    Save
                  </Button>
                </div>
                <div v-else class="flex items-center gap-x-2">
                  <Button :disabled="enableEditSection.length" variant="outline" size="sm" class="rounded" @click="onEdit">
                    <Icon name="icons:edit-box" /> Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <AccordionContent class="p-5">
            <Accordion v-model="accordion2" collapsible class="">
              <AccordionItem v-if="enableEdit" value="item-2" class="">
                <FormField v-slot="{ errorMessage }" v-model="formState.call_time" name="call_time">
                  <FormItem v-auto-animate>
                    <FormControl>
                      <AccordionTrigger :class="[formState.call_schedule_id && '!text-black', errorMessage && 'border-red-600']" class=" border rounded-lg h-11 px-3 py-[14px] flex items-center hover:no-underline text-muted-foreground text-sm font-normal">
                        <!-- {{ formState.call_time && Object.keys(formState.call_time).length ? formState.call_time.title : 'Select Call Time' }} -->
                        {{ scheduleTitle || 'Select Call Time' }}
                      </AccordionTrigger>
                    </FormControl>
                    <div v-if="errorMessage" class="text-red-600 text-sm">
                      {{ errorMessage === 'Required' ? 'Call Time is required' : errorMessage }}
                    </div>
                  </FormItem>
                </FormField>

                <AccordionContent class="p-3 border rounded-lg mt-1 ">
                  <CallTimesCreate @complete="callTimingListRefresh()">
                    <Button type="button" class="w-full rounded-[8px]">
                      Create Custom Call Time <Icon name="lucide:plus" />
                    </Button>
                  </CallTimesCreate>

                  <Command v-model="formState.call_schedule_id" selection-behavior="toggle" class="max-h-[300px] overflow-y-auto" @update:model-value="onSelectCallTime">
                    <CommandList>
                      <CommandGroup>
                        <template v-if="callTimingListStatus === 'pending'">
                          <CommandItem v-for="item in 10" :key="item" :value="item" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                            <Skeleton class="h-[50px] w-full" />
                          </CommandItem>
                        </template>
                        <CommandItem v-for="item in callTimingList" v-else :key="item.title" :value="item.id" class="text-sm flex items-center justify-between border-b last:border-b-0 py-3 cursor-pointer rounded-none">
                          {{ item.title }}
                          <Button type="reset" size="icon" variant="outline" @click.stop="() => { selectedRowData = item; callTimeSheet = true }">
                            <Icon name="mdi:eye" />
                          </Button>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem v-else value="item-3" class="">
                <div class="grid grid-cols-2">
                  <div class="space-y-2">
                    <div class="text-sm font-normal text-gray-400">
                      Time Based Calling
                    </div>
                    <div class="text-[16px] font-medium" :class="formState.time_based_calling ? 'text-green-600' : 'text-red-600'">
                      {{ formState.time_based_calling ? 'Yes' : 'No' }}
                    </div>
                  </div>
                  <div v-if="scheduleTitle" class="space-y-2">
                    <div class="text-sm font-normal text-gray-400">
                      Call Time
                    </div>
                    <div class="text-[16px] font-normal text-primary">
                      {{ scheduleTitle }}
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>

  <CallTimesTableSheet v-model:open="callTimeSheet" :call-time="selectedRowData as CallTimingList" />
</template>
