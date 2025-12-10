<script setup lang="ts">
const _props = defineProps({
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
      <div class="flex items-center justify-between px-5 py-4 bg-white border-b border-zinc-100">
        <div class="text-slate-800 text-base font-medium">
          Template Preview
        </div>
        <div class="flex items-center space-x-1 bg-slate-800/10 rounded-md p-0.5">
          <div
            class="bg-slate-800  text-white shadow text-sm py-1 px-3 flex items-center  rounded-md"
          >
            <Icon name="material-symbols:smartphone-outline" size="20" />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="h-[calc(100vh-245px)]">
        <div class="h-full">
          <div class="h-full p-3 flex justify-center items-center">
            <div
              class="h-full w-96 relative bg-[url('/images/sms/device.png')] bg-cover bg-top bg-no-repeat"
            >
              <!-- Message bubble container -->
              <div
                class="absolute top-[200px] left-[10%] w-fit max-w-[80%]"
                :class="{ hidden: !content }"
              >
                <!-- Bubble with hidden scrollbar but scrollable content -->
                <div
                  class="bg-gray-200 p-3 rounded-xl rounded-bl-none text-[13px]
                max-h-[300px] overflow-y-auto "
                >
                  <!-- This hides the scrollbar -->
                  <div class="break-words whitespace-pre-wrap">
                    {{ content || '&nbsp;' }}
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div
                v-if="!content"
                class="bg-gray-200 p-3 rounded-xl rounded-bl-none text-[13px]
              absolute top-[200px] left-[10%] max-w-[60%]"
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
