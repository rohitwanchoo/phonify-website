<script setup lang="ts">
import type { PaymentMethod } from '@/types/paymentMethod'

import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'

const props = defineProps<Props>()
const emits = defineEmits(['complete'])
const { formState, resetFormState } = useCreatePaymentMethod()

interface Props {
  data?: {
    id: string
    billing_details: {
      name: string
      address: {
        line1: string
        city: string
        country: string
        state: string
        postal_code: string
      }
    }
    card: {

      exp_month: number
      exp_year: number
    }
  } // id edit
}
const isEdit = computed(() => {
  return Boolean(props.data?.id)
})

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const step = ref<number>(1)

function setFormStateValues() {
  formState.value.full_name = props.data?.billing_details.name || ''
  formState.value.exp_month = props.data?.card?.exp_month || 0
  formState.value.exp_year = props.data?.card?.exp_year || 0
  formState.value.line1 = props.data?.billing_details.address.line1 || ''
  formState.value.city = props.data?.billing_details.address.city || ''
  formState.value.country = props.data?.billing_details.address.country || ''
  formState.value.state = props.data?.billing_details.address.state || ''
  formState.value.postal_code = props.data?.billing_details.address.postal_code || ''
}
function onUpdateOpen(val: boolean) {
  if (val) {
    step.value = 1
    if (isEdit.value)
      setFormStateValues()
  }
  else {
    resetFormState()
  }
}

const loading = ref<boolean>(false)

function onSubmit() {
  loading.value = true
  const payload: PaymentMethod = {
    ...formState.value,
    exp_month: String(formState.value.exp_month),
    exp_year: String(formState.value.exp_year),
    number: formState.value.number.replace(/\s/g, ''),
  }
  if (isEdit.value) {
    payload.payment_method_id = props.data?.id
    delete payload.cvc
    delete payload.number
  }
  useApi().post(`/stripe/${isEdit.value ? 'update-card' : 'save-card'}`, payload).then((res) => {
    showToast({
      type: 'success',
      message: res.message,
    })
    open.value = false
    emits('complete')
  }).catch((err) => {
    showToast({
      type: 'error',
      message: err.message,
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>

<template>
  <Dialog v-model:open="open" @update:open="onUpdateOpen">
    <DialogTrigger as-child>
      <slot>
        <Button class="h-11">
          <Icon class="!text-white" name="lucide:plus" />
          Add Card
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex justify-between">
          {{ isEdit ? 'Edit Payment Method' : 'Add Payment Method' }}
          <DialogClose class="cursor-pointer flex items-center">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>

      <!-- STEP - 2 -->
      <div v-if="step === 1">
        <BillingPaymentMethodsAddFormOne :is-edit="isEdit" @change-step="(val: number) => step = val" />
      </div>

      <!-- STEP - 3 -->
      <div v-else>
        <BillingPaymentMethodsAddFormTwo :is-edit="isEdit" :loading @change-step="(val: number) => step = val" @submit="onSubmit" />
      </div>
    </DialogContent>
  </Dialog>
</template>
