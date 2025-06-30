<script setup lang="ts">
import approveImage from '~/assets/svg/approve.svg'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'



defineEmits(['close'])

const open = defineModel<boolean>('open', { default: false })


</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="bg-[url('/images/dialog-background/decline-bg.jpg')] bg-cover bg-center">
      <div>
        <img class="h-[98px] w-[98px] mx-auto mt-10" :src="approveImage" alt="decline Image">
        <div class="text-center mt-4">
          <p class="text-xl font-semibold text-primary">
            Configuration Setting Verified
          </p>
          <p class="text-sm text-primary mb-5 mt-1">
            You Configuration setting has been verified, you can continue
          </p>
        </div>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" class="w-full h-10 bg-[#162D3A] text-white hover:bg-[#162D3A] hover:text-white" @click="open = false">
          <Icon name="material-symbols:close" size="18" />
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
