<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog'

const open = defineModel<boolean>('open', { default: false })

const onSubmit = () => {
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Approve IP Address</DialogTitle>
        <DialogDescription>
          Are you sure you want to approve this IP address?
        </DialogDescription>
      </DialogHeader>
     something
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="open = false">
          Cancel
        </Button>
        <Button type="submit" @click="onSubmit">
          Approve
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>