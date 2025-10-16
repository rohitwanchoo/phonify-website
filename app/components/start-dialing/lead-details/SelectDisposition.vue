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

interface Disposition {
  title: string
  id: number
  enable_sms: number
  d_type: string
}

interface Props {
  leadId?: number
  isOpen?: boolean
  dispositions?: Disposition[]
}
const props = withDefaults(defineProps<Props>(), {
  leadId: undefined,
  isOpen: false,
  dispositions: () => [],
})

const emit = defineEmits<{
  close: []
  save: []
  redial: []
}>()

const route = useRoute()

const selectedDisposition = ref<number>()
const title = ref('')
const pauseCalling = ref(false)

const open = ref(props.isOpen)

// Watch for prop changes and sync internal state
watch(() => props.isOpen, (newVal) => {
  open.value = newVal

  // Reset form when dialog opens
  if (newVal) {
    selectedDisposition.value = undefined
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
const saveLoading = ref(false)
function handleSave() {
  if (!selectedDisposition.value) {
    // You might want to show an error message here
    return
  }
  useApi().post('save-disposition', {
    campaign_id: route.query.campaign_id,
    disposition_id: selectedDisposition.value,
    lead_id: props.leadId,
    pause_calling: pauseCalling.value ? 1 : 0,
    api_call: 0,
  }).then((response) => {
    emit('save')
    showToast({
      message: response?.data?.message || 'Disposition saved successfully',
      type: 'success',
    })
  }).catch((error) => {
    handleError(error)
  }).finally(() => {
    saveLoading.value = false
  })
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
    <DialogContent class="rounded-[12px] w-full sm:max-w-[715px]" :disable-outside-pointer-events="true">
      <DialogHeader class="pb-3 border-b border-b-[#0000000D]">
        <DialogTitle class="text-primary text-base font-medium">
          Select Disposition
        </DialogTitle>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Disposition Selection Grid -->
        <div class="grid grid-cols-4 gap-3">
          <Label
            v-for="(item, index) in dispositions"
            :key="index"
            :for="`disposition-${index}`"
            class="h-11 text-sm text-primary rounded-lg flex gap-2 items-center justify-between px-3 cursor-pointer border border-[#00A0861A] transition-colors"
            :class="[
              selectedDisposition === item?.id ? 'bg-[#00A086] text-white' : 'bg-[#00A0860D] hover:bg-[#00A08620]',
            ]"
          >
            {{ item.title }}
            <input
              :id="`disposition-${index}`"
              v-model="selectedDisposition"
              type="radio"
              name="disposition"
              :value="item.id"
              class="ml-2 appearance-none size-4 checked:size-3 p-1 border border-primary rounded-full checked:bg-white checked:border-3 checked:border-[#00A086] checked:ring-1 ring-white"
            >
          </Label>
        </div>

        <!-- Pause Calling Toggle -->
        <div class="flex items-center justify-between">
          <Label class="text-xs text-[#162D3A]">Pause Calling</Label>
          <Switch
            v-model="pauseCalling"
            class="data-[state=checked]:bg-green-600"
          />
        </div>
      </div>

      <DialogFooter class="flex gap-3 justify-between items-center">
        <Button
          variant="outline"
          class="w-full h-11 flex-1 cursor-pointer"
          @click="handleRedial"
        >
          <Icon name="material-symbols:call" size="20" />
          Redial
        </Button>
        <Button
          class="w-full h-11 flex-1 cursor-pointer"
          :disabled="!selectedDisposition"
          :loading="saveLoading"
          @click="handleSave"
        >
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
