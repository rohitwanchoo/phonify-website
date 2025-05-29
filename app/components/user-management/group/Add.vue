<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <slot>
        <Button>
          <Icon class="!text-white" name="lucide:plus" />
          Add Group
        </Button>
      </slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[600px] [&>button]:hidden">
      <DialogHeader class="gap-y-[17px]">
        <DialogTitle class="text-[16px] font-medium flex items-center justify-between">
          Add Extension Group
          <DialogClose class="cursor-pointer">
            <Icon name="mdi:close" size="20" />
          </DialogClose>
        </DialogTitle>
        <Separator />
      </DialogHeader>
      <div class="">
        <div class="space-y-2">
          <Label for="name" class="text-right text-xs">
            Name
          </Label>
          <Input id="name" class="h-11" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose class="w-1/2">
          <Button variant="outline" class="border-red-600 w-full">
            <Icon name="mdi:close" />
            Close
          </Button>
        </DialogClose>

        <Button class="w-1/2" type="submit">
          <Icon name="material-symbols:save-outline" />
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
