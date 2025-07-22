<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  contact: {
    type: Object,
    required: true,
  },
  isUnknownContact: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['open-dialer'])

// Chat messages for saved contacts
const savedContactMessages = [
  { sender: 'me', text: 'enthallaaa?', time: '10.00 am' },
  { sender: 'them', text: 'sugam.', time: '10.01 am' },
  { sender: 'me', text: 'aysheri,verenthallaaa?', time: '10.01 am' },
  { sender: 'them', text: 'oo,anganoke pon..', time: '10.02 am' },
]

// Chat messages for unknown/unsaved contacts
const unknownContactMessages = [
  { sender: 'them', text: 'Hello, who is this?', time: '09.30 am' },
  { sender: 'me', text: 'This is John from ABC company', time: '09.31 am' },
  { sender: 'them', text: 'I dont recognize this number', time: '09.32 am' },
  { sender: 'me', text: 'We spoke last week about the project', time: '09.33 am' },
]

const currentMessages = computed(() =>
  props.isUnknownContact ? unknownContactMessages : savedContactMessages,
)

function openDialer() {
  emit('open-dialer')
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Top section -->
    <div class="flex flex-col justify-between flex-grow overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-muted flex justify-between items-center shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
            {{ contact.title.split(' ').map(w => w[0]).join('').slice(0, 2) }}
          </div>
          <div class="leading-tight">
            <div class="font-medium">
              {{ contact.title }}
            </div>
            <div class="text-sm text-muted-foreground">
              {{ contact.number }}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button class="bg-green-600 hover:bg-green-600 text-white text-sm p-[12px] rounded-md gap-1 flex cursor-pointer" @click="openDialer ">
            <Icon name="material-symbols:call" class="text-white" size="20" />
            Call
          </Button>
          <Button class="text-sm p-[12px] h-[44px] rounded-md text-black bg-white hover:bg-white border border-black flex gap-1 items-center cursor-pointer">
            <Icon name="material-symbols:demography" class="text-black" size="20" />
            Lead Activity
          </Button>
          <Button class="h-[44px] flex items-center">
            <Icon name="material-symbols:more-vert" class="text-black" size="20" />
          </Button>
        </div>
      </div>

      <!-- Chat Body -->
      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4" style="background-image: url('/images/chat-bg.png'); background-size: cover; background-repeat: repeat;">
        <div class="w-full flex justify-center mt-2 mb-4">
          <div class="text-xs text-muted-foreground bg-[#E4E4E7] rounded-xl px-3 py-1 text-center">
            {{ contact.time }}
          </div>
        </div>

        <template v-for="(message, index) in currentMessages" :key="index">
          <div v-if="message.sender === 'me'" class="flex justify-end">
            <div class="max-w-lg break-words bg-[#162D3A] text-white p-3 rounded-xl rounded-tr-none text-sm relative">
              {{ message.text }}
              <div class="flex justify-end items-center gap-1 text-[10px] text-white opacity-70 mt-1">
                {{ message.time }}
                <Icon name="material-symbols:done-all" class="text-white" size="14" />
              </div>
            </div>
          </div>
          <div v-else class="flex justify-start">
            <div class="max-w-lg break-words bg-[#E4E4E7] text-[#162D3A] p-3 rounded-xl rounded-tl-none text-sm">
              {{ message.text }}
              <div class="text-right text-[10px] text-[#162D3A] opacity-70 mt-1 flex items-center justify-end gap-1">
                {{ message.time }}
                <Icon name="material-symbols:done-all" class="text-[#162D3A]" size="14" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Unknown Contact Section -->
      <div v-if="isUnknownContact" class="px-4 py-3 bg-[#F5EFE9CC] rounded-lg border-muted m-5">
        <div class="flex flex-col items-center gap-3">
          <p class="text-md text-[#162D3A]">
            The number is not in your contacts
          </p>
          <div class="flex gap-3 ">
            <Button class="flex items-center gap-1 rounded-lg h-9 px-2 text-sm bg-white text-black font-normal hover:bg-white">
              <Icon name="material-symbols:check-circle-outline" />
              Continue
            </Button>
            <Button variant="outline" class="flex items-center gap-1 rounded-lg h-9 text-sm border-0 px-2 bg-white text-black font-normal hover:bg-white">
              <Icon name="material-symbols:person-add" />
              Add to Contacts
            </Button>
            <Button variant="outline" class="flex items-center gap-1 rounded-lg h-9 text-sm  px-2 bg-white border border-red-500 text-red-500 font-normal hover:bg-white hover:text-red-500">
              <Icon name="lucide:ban" />
              Block
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="">
      <!-- Footer -->
      <div class="bg-[#EBF5F3] py-2 border-t border-muted">
        <div class="flex items-center justify-between text-sm text-muted-foreground px-[24px]">
          <div>
            Send with
            <span class="text-primary font-medium underline underline-offset-1">+1 (569) 912-3502</span>
          </div>
          <Icon name="material-symbols:keyboard-arrow-down" size="22" />
        </div>
      </div>

      <!-- Input Field -->
      <div class="bg-white border-t border-muted py-2">
        <div class="relative w-full flex items-center">
          <Input
            placeholder="Send a message..."
            class="w-full pr-[200px]  px-[24px] py-5 border-none rounded-none bg-transparent placeholder:text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:shadow-none"
          />
          <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-4">
            <button type="button" class="text-muted-foreground hover:text-black border border-black h-10 w-10 flex items-center justify-center rounded-sm">
              <Icon name="material-symbols:attach-file" size="20" />
            </button>
            <button type="button" class="bg-[#0B2C3F] hover:bg-[#093142] text-white h-10 w-10 flex items-center justify-center rounded-sm">
              <Icon name="material-symbols:send-outline" size="20" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
