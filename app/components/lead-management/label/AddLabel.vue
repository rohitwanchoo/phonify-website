<script setup lang="ts">
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'

import Label from '~/components/ui/label/Label.vue'

const props = defineProps<{
  initialData?: {
    id: number
    title: string
    data_type?: string
    values?: string
    leadStatus?: number
  } | null
  open: boolean
}>()

const emit = defineEmits(['close', 'saved'])

const labelName = ref('')
const isSubmitting = ref(false)

// Fill form when editing
watch(() => props.initialData, (val) => {
  labelName.value = val?.title ?? ''
}, { immediate: true })

const isEditMode = computed(() => !!props.initialData?.id)

async function handleSubmit() {
  if (!labelName.value.trim()) {
    showToast({ type: 'error', message: 'Label name is required' })
    return
  }

  isSubmitting.value = true

  const payload = {
    title: labelName.value,
    edit_mode: true,
    data_type: 'text',
    required: false,
    merchant_required: false,
    number_length: 0,
    heading_type: '',
    values: '',
  }

  try {
    let res

    if (isEditMode.value) {
      // EDIT
      res = await useApi().post(`/crm-update-label/${props.initialData?.id}`, payload)
    }
    else {
      // CREATE
      res = await useApi().put('/crm-add-label', payload)
    }

    if (res?.success) {
      showToast({ type: 'success', message: res.message })
      emit('saved')
      emit('close')
    }
    else {
      showToast({ type: 'error', message: res.message || 'Operation failed' })
    }
  }
  catch {
    showToast({ type: 'error', message: 'Something went wrong' })
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('close')">
    <DialogContent>
      <DialogHeader class="pb-4 border-b border-[#0000000D]">
        <DialogTitle class="text-[#121E3D]">
          {{ isEditMode ? 'Edit Label' : 'Add Label' }}
        </DialogTitle>
      </DialogHeader>

      <div>
        <Label for="labelName" class="mb-1 text-xs text-[#162D3A]">
          Name
        </Label>
        <Input
          id="labelName"
          v-model="labelName"
          placeholder="Label Name"
          class="placeholder:text-sm placeholder:text-[#162D3A80] h-11 focus-visible:ring-0"
        />
      </div>

      <DialogFooter class="w-full mt-4">
        <Button variant="outline" class="flex-1 h-11" as-child>
          <DialogClose>
            <Icon name="material-symbols:close" size="20" />
            Close
          </DialogClose>
        </Button>
        <Button class="flex-1 h-11" :disabled="isSubmitting" @click="handleSubmit">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
