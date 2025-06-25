<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const dialogOpen = ref(false)
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <Button @click="dialogOpen = true">
      <Icon class="!text-white" name="lucide:plus" />
      Add VoIP Configuration
    </Button>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add VoIP Configuration</DialogTitle>
      </DialogHeader>
      <div class="py-6 text-center text-gray-500">
        Dummy UI for VoIP Configuration Dialog
      </div>
      <DialogFooter>
        <Button @click="dialogOpen = false">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
