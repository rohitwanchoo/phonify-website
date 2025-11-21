<script setup lang="ts">
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

// const _props = defineProps<{
//   data: any
// }>()
const open = defineModel<boolean>()
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetContent class="w-full md:min-w-[483px] gap-0">
      <SheetHeader class="bg-primary">
        <SheetTitle class="text-white">
          Prompt Details
        </SheetTitle>
      </SheetHeader>
      <div class="overflow-y-auto space-y-6 pb-6 px-5">
        <div class="grid grid-cols-2 h-24 items-center border-b border-zinc-100">
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <Icon name="material-symbols:speaker-outline" class="text-lg" />
              <span class="text-zinc-700 text-sm">
                Name
              </span>
            </Label>
            <p class="text-stone-900 font-medium">
              Logistics Inbound
            </p>
          </div>
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <Icon name="material-symbols:voice-chat-outline" class="text-lg" />
              <span class="text-zinc-700 text-sm">
                Voice
              </span>
            </Label>
            <p class="text-stone-900 font-medium">
              Coral
            </p>
          </div>
        </div>
        <div class="space-y-2 pb-6">
          <Label class="felx items-center gap-2">
            <Icon name="material-symbols:description-outline" class="text-lg" />
            <span class="text-zinc-700 text-sm">
              Description
            </span>
          </Label>
          <p class="text-stone-900 font-medium">
            Lorem ipsum dolor sit amet consectetur. In neque odio scelerisque consequat nulla donec orci in neque. Interdum nibh nec gravida viverra cursus leo auctor in mi. Pharetra interdum posuere tellus vulputate mi. Eget pellentesque massa vitae egestas etiam. Nibh vitae nunc mattis augue commodo vel.<br>Imperdiet lobortis tellus aliquam faucibus ut nec. Enim facilisis hendrerit felis donec tempor odio dignissim pellentesque iaculis. Consectetur quam hendrerit turpis pretium tempor. Sit egestas ligula dictum elementum scelerisque nisi quam. Sit nunc orci feugiat sapien risus pulvinar tempus.<br>Ultricies eget pretium sit aliquam quisque suscipit vivamus. Sit sed rhoncus etiam dui nullam. Vel bibendum praesent dictumst aliquam et. Ullamcorper diam nullam.
          </p>
        </div>
        <div class="space-y-2">
          <Label class="felx items-center gap-2">
            <Icon name="material-symbols:star-outline" class="text-lg" />
            <span class="justify-center text-zinc-800 text-sm">Functions</span>
          </Label>

          <div class="p-4 bg-zinc-100 rounded-lg border border-zinc-100 flex justify-between items-center">
            <div class="flex justify-start items-start gap-4">
              <div class="w-3.5 pt-1 flex flex-col justify-center items-center gap-2.5">
                <div class="justify-center text-stone-900 text-xs font-medium font-['DM_Sans']">
                  01.
                </div>
              </div>
              <div class="flex flex-col justify-center items-start gap-2">
                <div class="justify-center text-stone-900 text-base font-medium font-['DM_Sans']">
                  Tracking Shipment
                </div>
                <div class="flex justify-center items-center gap-1 text-zinc-800 text-sm">
                  Message:
                  <span>
                    10
                  </span>
                </div>
                <div class="flex justify-center items-center gap-1 text-zinc-500 text-sm">
                  Created at :
                  <span>
                    28/04/2025 02:45 PM
                  </span>
                </div>
              </div>
            </div>
            <div class="px-[5px] py-[3px] bg-blue-600/10 rounded-md border border-blue-600 flex justify-center items-center gap-1 text-stone-900 text-xs">
              SMS
            </div>
          </div>

          <div class="p-4 bg-zinc-100 rounded-lg border border-zinc-100 flex justify-between items-center">
            <div class="flex justify-start items-start gap-4">
              <div class="w-3.5 pt-1 flex flex-col justify-center items-start gap-2.5 text-stone-900 text-xs font-medium">
                02.
              </div>
              <div class="flex flex-col justify-center items-start gap-2">
                <div class="justify-center text-stone-900 text-base font-medium font-['DM_Sans']">
                  Tracking Shipment
                </div>
                <div class="flex justify-center items-center gap-1 text-zinc-800 text-sm">
                  Phone:
                  <span>
                    +1 912 (345) 6789
                  </span>
                </div>
                <div class="flex justify-center items-center gap-1 text-zinc-500 text-sm">
                  Created at :
                  <span>
                    28/04/2025 02:45 PM
                  </span>
                </div>
              </div>
            </div>
            <div class="px-[5px] py-[3px] bg-green-600/10 rounded-md border border-green-600 flex justify-center items-center gap-1 text-stone-900 text-xs">
              Call
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
