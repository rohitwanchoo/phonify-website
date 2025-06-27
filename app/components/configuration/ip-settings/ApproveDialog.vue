<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import approveImage from '~/assets/svg/approve.svg'

const open = defineModel<boolean>('open', { default: false })

// Define props for the row data
const props = defineProps<{
  rowData: {
    ip: string
    user: string
    location: string
    // Add other properties you need from the row
  } | null
}>()

const onSubmit = () => {
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="bg-[url('/images/dialog-background/approve-bg.jpg')] bg-cover bg-center">
      <div>
        <img class="h-[98px] w-[98px] mx-auto mt-10" :src="approveImage" alt="approval Image">
        <div class="text-center mt-4">
          <p class="text-xl font-semibold text-primary">
            Approve This IP!
          </p>
          <p class="text-sm text-primary mb-5 mt-1">
            You are about to approve this IP, do you wish to proceed?
          </p>
          <div v-if="props.rowData" class="space-y-2 mb-4">
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                Ip Address
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData.ip }}
              </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                User
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData.user }}
              </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm">
              <p class="text-sm text-muted-foreground">
                Location
              </p>
              <p class="text-sm text-primary">
                {{ props.rowData.location }}
              </p>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground py-4">
            No data available
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="open = false" class="w-[50%] h-10">
          <Icon name="material-symbols:close" size="18" />
          Close
        </Button>
        <Button type="submit" @click="onSubmit" class="w-[50%] h-10">
          <Icon name="material-symbols:check" size="18" />
          Approve
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>