<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import declineImage from '~/assets/svg/decline.svg'
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
        <img class="h-[98px] w-[98px] mx-auto mt-10" :src="declineImage" alt="approval Image">
        <div class="text-center mt-4">
            <p class="text-xl font-semibold text-primary">
                Decline This IP!
            </p>
            <p class="text-sm text-primary mb-5 mt-1">
                You are about to decline this IP, do you wish to proceed?
            </p>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm mb-2">
                <p class="text-sm text-muted-foreground">
                    Ip Address
                </p>
                <p class="text-sm text-primary">
                   49.36.189.247
                </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm mb-2">
                <p class="text-sm text-muted-foreground">
                    User
                </p>
                <p class="text-sm text-primary">
                   John Doe
                </p>
            </div>
            <div class="flex justify-between items-center h-10 bg-[#F2FAF9] p-3 border border-[#00A0861A] rounded-sm mb-2">
                <p class="text-sm text-muted-foreground">
                    Type
                </p>
                <p class="text-sm text-primary">
                   California, USA
                </p>
            </div>
        </div>
     </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="open = false" class="w-[50%] h-10">
            <Icon name="material-symbols:close" size="18" />
          Close
        </Button>
        <Button type="submit" @click="onSubmit" class="w-[50%] bg-red-600 h-10">
             <Icon name="material-symbols:block" size="18" />
          Decline
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>