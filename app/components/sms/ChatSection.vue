<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'

interface SmsMessageOutgoing {
  type: 'outgoing'
  message?: string
  date?: string | Date
}
interface SmsMessageIncoming {
  type: 'incoming'
  text?: string
  time?: string | Date
}
type SmsMessage = SmsMessageOutgoing | SmsMessageIncoming

interface Contact {
  number?: number
  did?: number
  user_id?: number
}

const props = withDefaults(defineProps<{
  messages: SmsMessage[]
  contact?: Contact
  loading?: boolean
}>(), {
  loading: false,
})

const emit = defineEmits(['openDialer'])
const isUnknownContact = computed(() => !props.contact?.user_id)

// Draft message and input ref must live inside the script setup
const currentDraft = ref('')
const messageInputRef = ref<HTMLInputElement | null>(null)
const loadingSms = ref(false)
const selectedFile = ref<File | null>(null)

interface NormalizedMessage {
  type: 'outgoing' | 'incoming'
  text: string
  at?: string | Date
  mediaUrl?: string
}

const normalizedMessages = computed<NormalizedMessage[]>(() => {
  if (!Array.isArray(props.messages))
    return []
  return props.messages.map((m: SmsMessage) => {
    if (m?.type === 'outgoing') {
      return {
        type: 'outgoing',
        text: m.message || '',
        at: m.date,
        mediaUrl: (m as any)?.mms_url || '',
      }
    }
    return {
      type: 'incoming',
      text: (m as SmsMessageIncoming)?.text || (m as unknown as SmsMessageOutgoing)?.message || '',
      at: (m as SmsMessageIncoming)?.time || (m as unknown as SmsMessageOutgoing)?.date,
      mediaUrl: (m as any)?.mms_url || '',
    }
  })
})

function openDialer() {
  emit('openDialer')
}

async function sendMessage(file?: File) {
  loadingSms.value = true
  try {
    let body: any
    if (file) {
      const formData = new FormData()
      formData.append('from', String(props.contact?.did ?? ''))
      formData.append('to', String(props.contact?.number ?? ''))
      formData.append('message', String(currentDraft.value || ''))
      formData.append('mms_file', file)
      formData.append('date', new Date().toISOString())
      body = formData
    }
    else {
      body = {
        from: props.contact?.did,
        to: props.contact?.number,
        message: currentDraft.value,
        mms_file: null,
        date: new Date(),
      }
    }
    const response = await useApi().post('/send-sms', body)
    if (response?.success === true) {
      showToast({
        message: response?.message,
        type: 'success',
      })
      currentDraft.value = ''
      selectedFile.value = null
      // focus back the input for quick consecutive sends
      requestAnimationFrame(() => {
        messageInputRef.value?.focus()
      })
      refreshNuxtData('sms-chats')
    }
    else {
      showToast({
        message: response?.message,
        type: 'error',
      })
    }
  }
  catch (error: any) {
    showToast({
      message: error?.message,
      type: 'error',
    })
  }
  finally {
    loadingSms.value = false
  }
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input?.files?.[0] || null
  if (!file)
    return
  selectedFile.value = file
  sendMessage(file).finally(() => {
    selectedFile.value = null
    if (input)
      input.value = ''
  })
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Top section -->
    <div class="flex flex-col justify-between flex-grow overflow-hidden">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-muted flex justify-between items-center shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-10! h-10 px-0! py-0! rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-semibold">
            <Icon name="material-symbols:account-circle" size="24" />
          </div>
          <div class="leading-tight">
            <div class="font-medium">
              <!-- {{ displayName }} -->
              {{ formatNumber(String(props.contact?.number)) }}
            </div>
            <div class="text-sm text-muted-foreground">
              <!-- {{ contactNumber }} -->
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button class="bg-green-600 hover:bg-green-500 text-white text-sm p-[12px] h-11 rounded-md gap-1 flex cursor-pointer" @click="openDialer">
            <Icon name="material-symbols:call" class="text-white" size="20" />
            Call
          </Button>
          <Button class="text-sm p-[12px] h-[44px] rounded-md text-black bg-white hover:bg-[#F8F8F8] border border-black flex gap-1 items-center cursor-pointer">
            <Icon name="material-symbols:demography" class="text-black" size="20" />
            Lead Activity
          </Button>
          <Button class="h-[44px] p-0 flex items-center bg-white shadow-none hover:bg-white">
            <Icon name="material-symbols:more-vert" class="text-black" size="20" />
          </Button>
        </div>
      </div>
      <!-- Chat Body -->
      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4" style="background-image: url('/images/chat-bg.png'); background-size: cover; background-repeat: repeat;">
        <div class="w-full flex justify-center mt-2 mb-4">
          <div class="text-xs text-muted-foreground bg-[#E4E4E7] rounded-xl px-3 py-1 text-center">
            <!-- {{ contact.time }} -->
          </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="loading" class="w-full flex justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#162D3A]" />
        </div>

        <template v-else>
          <div v-for="(msg, index) in normalizedMessages" :key="index">
            <div v-if="msg.type === 'outgoing'" class="flex justify-end">
              <div class="max-w-lg break-words bg-[#162D3A] text-white p-3 rounded-xl rounded-tr-none text-sm relative">
                <img v-if="msg.mediaUrl" :src="msg.mediaUrl" alt="image" class="mb-2 max-w-[240px] max-h-[240px] rounded-md">
                <div v-if="msg.text">
                  {{ msg.text }}
                </div>
                <div class="flex justify-end items-center gap-1 text-[10px] text-white opacity-70 mt-1">
                  {{ formatDate(new Date(msg.at || ''), 'h:mm A') }}
                  <Icon name="material-symbols:done-all" class="text-white" size="14" />
                </div>
              </div>
            </div>
            <div v-else class="flex justify-start">
              <div class="max-w-lg break-words bg-[#E4E4E7] text-[#162D3A] p-3 rounded-xl rounded-tl-none text-sm">
                <img v-if="msg.mediaUrl" :src="msg.mediaUrl" alt="image" class="mb-2 max-w-[240px] max-h-[240px] rounded-md">
                <div v-if="msg.text">
                  {{ msg.text }}
                </div>
                <div class="text-right text-[10px] text-[#162D3A] opacity-70 mt-1 flex items-center justify-end gap-1">
                  {{ formatDate(new Date(msg.at || ''), 'h:mm A') }}
                  <Icon name="material-symbols:done-all" class="text-[#162D3A]" size="14" />
                </div>
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
    <div>
      <!-- Footer -->
      <div class="bg-[#EBF5F3] py-2 border-t border-muted">
        <div class="flex items-center justify-between text-sm text-muted-foreground px-[24px]">
          <div>
            Send with
            <span class="text-primary font-medium underline underline-offset-1">
              {{ formatNumber(String(props.contact?.did)) }}
            </span>
          </div>
          <Icon name="material-symbols:keyboard-arrow-down" size="22" />
        </div>
      </div>

      <!-- Input Field -->
      <div class="bg-white border-t border-muted py-4 px-6">
        <div class="w-full flex items-center">
          <Input
            ref="messageInputRef"
            v-model="currentDraft"
            placeholder="Send a message..."
            class="w-full pl-0 border-none shadow-none rounded-none bg-transparent placeholder:text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none"
          />
          <div class="flex items-center gap-2">
            <div class="relative cursor-pointer">
              <Input
                type="file"
                class="relative z-10 h-11 w-11 px-0! py-0! bg-transparent file:text-transparent rounded-lg border border-stone-900 inline-flex justify-start items-center cursor-pointer"
                @change="handleFileChange"
              />
              <Icon name="material-symbols:attach-file" size="20" class="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer" />
            </div>
            <Button
              type="button"
              size="icon"
              :loading="loadingSms"
              :disabled="loadingSms || !currentDraft"
              class="h-11 w-11"
              @click="sendMessage()"
            >
              <Icon name="material-symbols:send-outline" size="20" :class="loadingSms ? 'hidden' : 'block'" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
