<script setup lang="ts">
import { useConfirmDialog } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const props = defineProps<Props>()

const emits = defineEmits(['complete'])

const {
  isRevealed: showDeleteConfirm,
  reveal: revealDeleteConfirm,
  confirm: deleteConfirm,
  cancel: deleteCancel,
} = useConfirmDialog()

interface Props {
  data: {
    id: string
    name: string
    card: {
      brand: string
      last4: string
      exp_month: string
      exp_year: string
    }
  }
  type?: string
}
async function deleteMethod() {
  const { isCanceled } = await revealDeleteConfirm()
  if (isCanceled) {
    return false
  }
  useApi().get(`/delete-payment-method/${props.data.id}`).then((response) => {
    showToast({
      message: response.message,
    })
  }).catch((error) => {
    showToast({
      type: 'error',
      message: error.message,
    })
  })
}
const editPaymentMethodOpen = ref(false)
const viewPaymentMethodOpen = ref(false)

function onEdit() {
  viewPaymentMethodOpen.value = false
  editPaymentMethodOpen.value = true
}
</script>

<template>
  <div class="border rounded-lg flex justify-between py-5 px-4">
    <div>
      <div class="flex gap-x-4 items-center">
        <img :src="type" class="h-10 w-[56px]" alt="masterCard">
        <div>
          <div class="text-[16px] font-medium">
            {{ data?.card?.brand }}
          </div>
          <div class="text-xs text-gray-500">
            XXXX XXXX XXXX {{ data?.card?.last4 }} &#xb7;  Expiry: {{ data?.card?.exp_month }}/{{ data?.card?.exp_year }}
          </div>
        </div>
      </div>
    </div>
    <div class="space-x-3">
      <!-- View card details -->
      <BillingPaymentMethodsView v-model:open="viewPaymentMethodOpen" :data="data" @remove="deleteMethod" @edit="onEdit" />

      <!-- Edit card details -->
      <BillingPaymentMethodsAdd v-model:open="editPaymentMethodOpen" :data @complete="emits('complete')">
        <Button variant="outline" size="icon">
          <Icon name="material-symbols:edit-square" />
        </Button>
      </BillingPaymentMethodsAdd>

      <Button variant="outline" size="icon" class="text-red-600 border-red-600 hover:text-red-600/80" @click="deleteMethod">
        <Icon name="mdi:trash-can" />
      </Button>
    </div>
  </div>
  <ConfirmAction v-model="showDeleteConfirm" :confirm="deleteConfirm" :cancel="deleteCancel" title="Delete Payment Method" description="You are about to delete payment method. Do you wish to proceed?" />
</template>
