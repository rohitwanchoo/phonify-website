<script setup lang="ts">
import type { Campaign } from '~/types/campaign'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'

const props = defineProps<{
  values: any
  isPreview: boolean
  loading: boolean
}>()

const emit = defineEmits(['cancelEdit', 'submit'])

const { formState, enableEditSection } = useCreateCampaign()

const enableEdit = computed(() => enableEditSection.value === 'send-details' || !props.isPreview)

const sendEmailOptions = [
  {
    id: 0,
    name: 'No',
  },
  {
    id: 1,
    name: 'With User Email',
  },
  {
    id: 2,
    name: 'With Campaign Email',
  },
  {
    id: 3,
    name: 'With System Email ',
  },
]
function cancelEdit() {
  enableEditSection.value = ''
  emit('cancelEdit')
}
</script>

<template>
  <div class="border rounded-lg bg-white">
    <div class="border-b px-5 pt-5 pb-3 flex items-center justify-between">
      <div class="text-[16px] font-medium text-primary/100">
        Send Details (temp.)
      </div>
      <div v-if="isPreview " class="flex items-center gap-x-2">
        <div v-if="enableEditSection === 'send-details'" class="flex gap-x-2">
          <Button variant="outline" size="sm" class="rounded" @click="cancelEdit">
            <Icon name="lucide:x" />
            Cancel
          </Button>
          <Button class="w-[105px] rounded" type="submit" size="sm" :disabled="loading" @click="emit('submit')">
            <Icon :name="loading ? 'eos-icons:loading' : 'material-symbols:save-rounded'" />
            Save
          </Button>
        </div>
        <div v-else class="flex items-center gap-x-2">
          <Button :disabled="enableEditSection.length" variant="outline" size="sm" class="rounded" @click="enableEditSection = 'send-details'">
            <Icon name="icons:edit-box" /> Edit
          </Button>
        </div>
      </div>
    </div>
    <div class="p-5 gap-x-5 w-full flex items-center">
      <div class="w-1/2">
        <!-- <Label class="text-sm font-normal mb-5">Send Email</Label> -->
        <FormField v-slot="{ componentField, errorMessage }" v-model="formState.email" name="email">
          <FormItem v-auto-animate>
            <FormLabel class="font-normal text-sm">
              Send Email
            </FormLabel>
            <FormControl>
              <Select v-if="enableEdit" v-bind="componentField">
                <SelectTrigger :class="errorMessage && 'border-red-600'" class="w-full !h-11">
                  <SelectValue class="text-sm data-[placeholder]:text-muted-foreground" placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem v-for="item in sendEmailOptions" :key="item.id" :value="item.id">
                      {{ item.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div v-else class="text-[16px] font-normal text-primary">
                {{ sendEmailOptions.find((item) => item.id === formState.email)?.name }}
              </div>
            </FormControl>
            <!-- <FormMessage class="text-sm" /> -->
            <div v-if="errorMessage" class="text-red-600 text-sm">
              {{ errorMessage === 'Required' ? 'Email is required' : errorMessage }}
            </div>
          </FormItem>
        </FormField>
      </div>
      <div class="w-1/2 flex items-center justify-between">
        <div class="flex flex-col gap-y-3">
          <FormField v-slot="{ value, handleChange }" v-model="formState.sms" name="sms">
            <FormItem class="flex flex-col gap-y-3">
              <FormLabel class="text-sm font-normal">
                Send SMS
              </FormLabel>
              <FormControl>
                <Switch
                  v-if="enableEdit"
                  id="send-sms"
                  class="data-[state=checked]:bg-green-600"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
                <div v-else :class="formState?.sms ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-normal">
                  {{ formState?.sms ? 'Yes' : 'No' }}
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col gap-y-3">
          <FormField v-slot="{ value, handleChange }" v-model="formState.send_report" name="send_report">
            <FormItem class="flex flex-col gap-y-3">
              <FormLabel class="text-sm font-normal">
                Send Report
              </FormLabel>
              <FormControl>
                <Switch
                  v-if="enableEdit"
                  id="send-report"
                  class="data-[state=checked]:bg-green-600"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
                <div v-else :class="formState?.send_report ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-normal">
                  {{ formState?.send_report ? 'Yes' : 'No' }}
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </div>
        <div class="flex flex-col gap-y-3">
          <FormField v-slot="{ value, handleChange }" v-model="formState.call_transfer" name="call_transfer">
            <FormItem class="flex flex-col gap-y-3">
              <FormLabel class="text-sm font-normal">
                Call Transfer
              </FormLabel>
              <FormControl>
                <Switch
                  v-if="enableEdit"
                  id="call-transfer"
                  class="data-[state=checked]:bg-green-600"
                  :model-value="value"
                  @update:model-value="handleChange"
                />
                <div v-else :class="formState?.call_transfer ? 'text-green-600' : 'text-red-600'" class="text-[16px] font-normal">
                  {{ formState?.call_transfer ? 'Yes' : 'No' }}
                </div>
              </FormControl>
            </FormItem>
          </FormField>
        </div>
      </div>
    </div>
  </div>
</template>
