<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'

const props = defineProps<{
  open: boolean
  row: any
}>()
const emit = defineEmits(['update:open'])

const dialogOpen = computed({
  get: () => props.open,
  set: val => emit('update:open', val),
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit VoIP Configuration</DialogTitle>
      </DialogHeader>
      <div class="py-6 text-center text-gray-500">
        Dummy UI for editing VoIP configuration.<br>
        <span v-if="row">Editing: <b>{{ row.name }}</b></span>
      </div>
      <DialogFooter>
        <Button @click="dialogOpen = false">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
