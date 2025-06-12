<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import Input from '~/components/ui/input/Input.vue'
import Label from '~/components/ui/label/Label.vue'
</script>

<template>
  <Dialog>
    <DialogTrigger>
      <Button>
        <Icon class="!text-white text-sm" name="material-symbols:add" size="20" />
        Add Label
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="pb-4 border-b border-[#0000000D]">
        <DialogTitle class="text-[#121E3D]">
          Add Label
        </DialogTitle>
      </DialogHeader>

      <div>
        <Label for="" class="mb-1 text-xs text-[#162D3A]">
          Name
        </Label>
        <Input placeholder="Label Name" class="placeholder:text-sm placeholder:text-[#162D3A80] h-11" />
      </div>

      <DialogFooter class="w-full">
        <Button variant="outline" class="flex-1 h-11">
          <Icon name="material-symbols:close" size="20" />
          Close
        </Button>
        <Button class="flex-1 h-11">
          <Icon name="material-symbols:save" size="20" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
