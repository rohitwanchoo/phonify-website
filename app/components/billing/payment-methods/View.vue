<script setup lang="ts">
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Separator } from '@/components/ui/separator'

defineProps<Props>()
const emits = defineEmits(['remove', 'edit'])
const open = defineModel('open', {
  type: Boolean,
  default: false,
})
interface Props {
  data: any
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot>
        <Button variant="outline" size="icon">
          <Icon name="mdi:eye" />
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex justify-between">
          Card Details
          <DialogClose class="cursor-pointer flex items-center">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <div class="space-y-4">
        <div class="text-sm text-[#162D3AB2]">
          Card Number
          <div class="text-[16px] text-primary">
            {{ data?.card?.brand }} XXXX XXXX XXXX {{ data?.card?.last4 }}
          </div>
        </div>
        <div class="text-sm text-[#162D3AB2]">
          Expires On
          <div class="text-[16px] text-primary">
            {{ data?.card?.exp_month }}/{{ data?.card?.exp_year }}
          </div>
        </div>
        <div class="text-sm text-[#162D3AB2]">
          Name on Card
          <div class="text-[16px] text-primary">
            {{ data?.billing_details?.name }}
          </div>
        </div>
        <div class="text-sm text-[#162D3AB2]">
          Billing Address
          <div class="text-[16px] text-primary">
            {{ data?.billing_details?.address?.line1 }},
            {{ data?.billing_details?.address?.city }}, <br>
            {{ data?.billing_details?.address?.country }}
            {{ data?.billing_details?.address.postal_code }}
            {{ data?.billing_details?.address.state }}
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose class="sm:w-1/2">
          <Button variant="outline" class="h-11 border-red-600 hover:text-red-600 text-red-600 w-full" @click="emits('remove')">
            <Icon name="mdi:trash-can" />
            Remove
          </Button>
        </DialogClose>
        <Button class="h-11 sm:w-1/2" type="submit" @click="emits('edit')">
          <Icon name="mdi:pencil" />
          Edit
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
