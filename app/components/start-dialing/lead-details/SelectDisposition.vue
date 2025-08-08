<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Switch } from '~/components/ui/switch'

const selectedDisposition = ref('')

const disposition = [
  {
    label: 'Callback',
    value: 'callback',
  },
  {
    label: 'No Answer',
    value: 'no_answer',
  },
  {
    label: 'Not Interested',
    value: 'not-interested',
  },
  {
    label: 'Sale',
    value: 'sale',
  },
  {
    label: 'Voicemail Left',
    value: 'voicemail-left',
  },
  {
    label: 'Scheduled',
    value: 'scheduled',
  },
  {
    label: 'Interested',
    value: 'interested',
  },
  {
    label: 'Not Interested',
    value: 'not_interested',
  },
  {
    label: 'More Info',
    value: 'more-info',
  },
  {
    label: 'Appointment',
    value: 'appointment',
  },
  {
    label: 'Wrong Number',
    value: 'wrong_number',
  },
  {
    label: 'Call Back Later',
    value: 'call_back_later',
  },
  {
    label: 'Disqualified',
    value: 'disqualified',
  },
  {
    label: 'Need to Consult',
    value: 'need_to_consult',
  },
  {
    label: 'Not Ready',
    value: 'not_ready',
  },
  {
    label: 'Customer Refers',
    value: 'customer_refers',
  },
  {
    label: 'Positive',
    value: 'positive',
  },
  {
    label: 'Negative',
    value: 'negative',
  },
  {
    label: 'Unsubscribe',
    value: 'unsubscribe',
  },
]

function handleSave() {
  console.log('Selected:', selectedDisposition.value)
  // Trigger save/emit/api call here
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="rounded-[12px] w-full sm:max-w-[715px]">
      <DialogHeader class="pb-3 border-b border-b-[#0000000D]">
        <DialogTitle class="text-primary text-base font-medium">
          Select Disposition
        </DialogTitle>
      </DialogHeader>
      <div class="grid grid-cols-4 gap-3">
        <Label
          v-for="(item, index) in disposition"
          :key="index"
          :for="`disposition-${index}`"
          class="h-11 text-sm text-primary rounded-lg flex gap-2 items-center justify-between px-3 cursor-pointer border border-[#00A0861A]" :class="[
            selectedDisposition === item.value ? 'bg-[#00A086] text-white' : 'bg-[#00A0860D]',
          ]"
        >
          {{ item.label }}
          <input
            :id="`disposition-${index}`"
            v-model="selectedDisposition"
            type="radio"
            name="disposition"
            :value="item.value"
            class="ml-2 appearance-none size-4 checked:size-3 p-1 border border-primary rounded-full checked:bg-white checked:border-3 checked:border-[#00A086] checked:ring-1 ring-white"
          >
        </Label>
      </div>

      <div>
        <Label class="text-xs text-[#162D3A] mb-1">Title</Label>
        <Input type="datetime-local" class="w-full placeholder:text-[#162D3A80]" />
      </div>

      <div class="flex items-center justify-between">
        <Label class="text-xs text-[#162D3A]">Pause Calling</Label>
        <Switch class="data-[state=checked]:bg-green-600" />
      </div>

      <DialogFooter class="flex gap-3 justify-between items-center">
        <Button variant="outline" class="w-full flex-1 cursor-pointer">
          <Icon name="material-symbols:call" size="20" />
          Redial
        </Button>
        <Button class="w-full flex-1 cursor-pointer" @click="handleSave">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
