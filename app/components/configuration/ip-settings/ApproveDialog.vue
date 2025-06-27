<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import approveImage from '~/assets/svg/approve.svg'
import background from '~/assets/svg/approve-bg.jpg'

const open = defineModel<boolean>('open', { default: false })

const onSubmit = () => {
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open" :style="{ backgroundImage: `url(${background})` }">
    <DialogContent>
     <div>
        <img class="h-[98px] w-[98px] mx-auto" :src="approveImage" alt="">
     </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="open = false" class="w-[50%]">
          close
        </Button>
        <Button type="submit" @click="onSubmit" class="w-[50%]">
          Approve
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>