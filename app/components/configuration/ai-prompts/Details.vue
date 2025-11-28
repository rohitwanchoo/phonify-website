<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const _props = defineProps<{
  data: any
}>()
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
              {{ data?.title }}
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
              {{ data?.voice_name }}
            </p>
          </div>
        </div>
        <div class="space-y-2 pb-6 border-b border-zinc-100">
          <Label class="felx items-center gap-2">
            <Icon name="material-symbols:description-outline" class="text-lg" />
            <span class="text-zinc-700 text-sm">
              Description
            </span>
          </Label>
          <p class="text-stone-900 font-medium max-h-[450px] overflow-y-auto">
            {{ data?.description }}
          </p>
        </div>
        <div class="space-y-2">
          <Label class="felx items-center gap-2">
            <Icon name="material-symbols:star-outline" class="text-lg" />
            <span class="justify-center text-zinc-800 text-sm">Functions</span>
          </Label>

          <div v-if="data?.functions.length" class="space-y-2">
            <div v-for="(item, index) in data?.functions" :key="index" class="p-4 bg-zinc-100 rounded-lg border border-zinc-100 flex justify-between items-center">
              <div class="flex justify-start items-start gap-4">
                <div class="w-3.5 pt-1 flex flex-col justify-center items-center gap-2.5">
                  <div class="justify-center text-stone-900 text-xs font-medium font-['DM_Sans']">
                    {{ index + 1 }}.
                  </div>
                </div>
                <div class="flex flex-col justify-center items-start gap-2">
                  <div class="justify-center text-stone-900 text-base font-medium font-['DM_Sans']">
                    {{ item?.name }}
                  </div>
                  <div v-if="item?.type === 'sms'" class="flex justify-center items-center gap-1 text-zinc-800 text-sm">
                    Message:
                    <span>
                      {{ item?.message }}
                    </span>
                  </div>
                  <div v-else-if="item?.type === 'call'" class="flex justify-center items-center gap-1 text-zinc-800 text-sm">
                    Phone:
                    <span>
                      {{ formatNumber(item?.phone) }}
                    </span>
                  </div>
                  <div v-else-if="item?.type === 'api'" class="flex justify-center items-start gap-1 text-zinc-800 text-sm">
                    {{ item?.api_method }}:
                    <span>
                      {{ item?.api_url }}
                    </span>
                  </div>
                  <div class="flex justify-center items-center gap-1 text-zinc-500 text-sm">
                    Created at :
                    <span>
                      {{ formatDate(new Date(item?.created_at), 'DD/MM/YYYY hh:mm A') }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                class="px-[5px] py-[3px] rounded-md border flex justify-center items-center gap-1 text-stone-900 text-xs capitalize"
                :class="{
                  'bg-blue-600/10 border-blue-600 uppercase': item.type === 'sms',
                  'bg-green-600/10 border-green-600': item.type === 'call',
                  'bg-violet-600/10 border-violet-600 uppercase': item.type === 'api',
                  'bg-orange-500/10 border-orange-600': item.type === 'email'
                }"
              >
                {{ item.type }}
              </div>
            </div>
          </div>
          <div v-else>
            <p class="text-base font-medium">
              No functions added to this prompt.
            </p>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
