<script setup lang="ts">
import preview from '~/assets/svg/sms/template-preview.svg'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="w-full bg-white rounded-xl outline outline-offset-[-1px] outline-zinc-100 inline-flex flex-col justify-start items-start overflow-hidden">
    <div default-value="desktop" class="w-full gap-0">
      <!-- Header with triggers -->
      <div class="flex items-center justify-between px-5 py-3 bg-white border-b border-zinc-100">
        <div class="text-slate-800 text-base font-medium">
          Template Preview
        </div>
        <div class="flex space-x-1 bg-slate-800/10 rounded-md p-0.5">
          <div
            class="bg-slate-800  text-white shadow text-sm px-3 py-1 rounded-md"
          >
            <Icon name="material-symbols:smartphone-outline" size="20" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="h-[calc(100vh-250px)]">
        <div class="h-full">
          <div value="mobile" class="h-full p-3">
            <div
              class="w-full h-full relative bg-contain bg-center bg-no-repeat"
              :style="{ 'background-image': `url(${preview})` }"
            >
              <!-- Updated message bubble with proper styling -->
              <div
                class="bg-gray-200 p-3 rounded-xl rounded-bl-none text-[13px] absolute top-1/4 left-1/5 max-w-[60%]"
                :class="{ hidden: !content }"
              >
                <div class="break-words whitespace-pre-wrap overflow-hidden">
                  {{ content || '&nbsp;' }}
                </div>
              </div>
              <div
                v-if="!content"
                class="bg-gray-200 p-3 rounded-xl rounded-bl-none text-[13px] absolute top-1/4 left-1/5 max-w-[60%]"
              >
                Preview will appear here....
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
