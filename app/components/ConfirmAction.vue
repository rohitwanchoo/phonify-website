<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'
import deleteImage from '~/assets/svg/delete.svg'

const props = defineProps({
  img: {
    type: String,
    default: deleteImage,
  },
  title: String,
  description: String,
  cancel: Function,
  confirm: Function,
})
const open = defineModel<boolean>()
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent class="w-[445px]">
      <AlertDialogHeader>
        <AlertDialogCancel class="border-none w-fit shadow-none ml-auto p-0 max-h-5" @click="props.cancel?.()">
          <Icon name="material-symbols:close" size="20" />
        </AlertDialogCancel>
        <slot name="header">
          <img class="h-[98px] w-[98px] mx-auto" :src="img" alt="">
          <AlertDialogTitle class="text-center text-[#6D7076]">
            <div>
              {{ title }}
            </div>
          </AlertDialogTitle>
        </slot>
        <AlertDialogDescription class="text-sm font-normal text-center">
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter class="justify-between">
        <slot name="actions">
          <AlertDialogCancel class="w-[49%] h-11 font-normal text-primary " @click="props.cancel?.()">
            <Icon name="material-symbols:close" />
            <span class="text-[#6D7076]">Close</span>
          </AlertDialogCancel>
          <Button class="w-[49%] h-11 font-normal bg-red-600 hover:bg-red-600/80" @click="() => { open = false; props.confirm?.() }">
            <Icon name="material-symbols:delete" />
            Delete
          </Button>
        </slot>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
