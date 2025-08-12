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

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  close: []
  save: [disposition: string, title?: string, pauseCalling?: boolean]
  redial: []
}>()

const selectedDisposition = ref('')
const title = ref('')
const pauseCalling = ref(false)

const open = ref(props.isOpen)

// Watch for prop changes and sync internal state
watch(() => props.isOpen, (newVal) => {
  open.value = newVal

  // Reset form when dialog opens
  if (newVal) {
    selectedDisposition.value = ''
    title.value = ''
    pauseCalling.value = false
  }
}, { immediate: true })

// Watch for internal open state changes to emit close event
watch(open, (newVal) => {
  if (!newVal && props.isOpen) {
    emit('close')
  }
})

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
  if (!selectedDisposition.value) {
    // You might want to show an error message here
    return
  }

  emit('save', selectedDisposition.value, title.value, pauseCalling.value)
  open.value = false
}

function handleRedial() {
  emit('redial')
  open.value = false
}

// Handle dialog close via escape key or click outside
function handleDialogClose() {
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="handleDialogClose">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="rounded-[12px] w-full sm:max-w-[715px]">
      <DialogHeader class="pb-3 border-b border-b-[#0000000D]">
        <DialogTitle class="text-primary text-base font-medium">
          Select Disposition
        </DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Disposition Selection Grid -->
        <div class="grid grid-cols-4 gap-3">
          <Label
            v-for="(item, index) in disposition"
            :key="index"
            :for="`disposition-${index}`"
            class="h-11 text-sm text-primary rounded-lg flex gap-2 items-center justify-between px-3 cursor-pointer border border-[#00A0861A] transition-colors"
            :class="[
              selectedDisposition === item.value ? 'bg-[#00A086] text-white' : 'bg-[#00A0860D] hover:bg-[#00A08620]',
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

        <!-- Title Input -->
        <div>
          <Label class="text-xs text-[#162D3A] mb-1 block">Title</Label>
          <Input
            v-model="title"
            type="datetime-local"
            class="w-full placeholder:text-[#162D3A80]"
            placeholder="Optional title or notes"
          />
        </div>

        <!-- Pause Calling Toggle -->
        <div class="flex items-center justify-between">
          <Label class="text-xs text-[#162D3A]">Pause Calling</Label>
          <Switch
            v-model:checked="pauseCalling"
            class="data-[state=checked]:bg-green-600"
          />
        </div>
      </div>

      <DialogFooter class="flex gap-3 justify-between items-center">
        <Button
          variant="outline"
          class="w-full flex-1 cursor-pointer"
          @click="handleRedial"
        >
          <Icon name="material-symbols:call" size="20" />
          Redial
        </Button>
        <Button
          class="w-full flex-1 cursor-pointer"
          :disabled="!selectedDisposition"
          @click="handleSave"
        >
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
