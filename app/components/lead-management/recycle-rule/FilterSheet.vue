<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '~/components/ui/button'
import { Icon } from '#components'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div>
    <Button variant="outline" class="!text-primary" @click="open = true">
      <Icon name="material-symbols:sort" class="!text-primary" />
      Filter
    </Button>
    <Sheet v-model:open="open">
      <SheetContent class="min-w-[483px]">
        <SheetHeader class="bg-[#162D3A]">
          <SheetTitle class="text-white">
            Filter Recycle Rules
          </SheetTitle>
        </SheetHeader>
        <div>
          <div class="mx-auto p-6 space-y-6">
            <!-- Placeholder for filter fields, update content as needed -->
            <div class="text-center text-muted-foreground text-sm">
              (Add filter fields here)
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
    ``