<script setup lang="ts">
import { formatDate } from '@vueuse/core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  hasMore?: boolean
}>(), {
  loading: false,
  hasMore: true,
})

const emit = defineEmits(['openDialer', 'loadMore'])
// const isUnknownContact = computed(() => !props.contact?.user_id)

// Draft message and input ref must live inside the script setup
const currentDraft = ref('')
const messageInputRef = ref<HTMLInputElement | null>(null)
const loadingSms = ref(false)
const selectedFile = ref<File | null>(null)

const { data: smsDidList, status: smsDidListStatus, refresh: refreshSmsDidList } = await useLazyAsyncData('sms-did-list', () =>
  useApi().get('sms_did_list'), {
  transform: res => res.data,
  immediate: false,
})

const selectedDid = ref<number | string | undefined>(props.contact?.did)

watch(() => props.contact?.did, (newDid) => {
  if (newDid) {
    selectedDid.value = newDid
  }
})

onMounted(() => {
  refreshSmsDidList()
  scrollToBottom()
})

interface NormalizedMessage {
  type: 'outgoing' | 'incoming'
  text: string
  at?: string | Date
  mediaUrl?: string
}

const previewUrl = ref<string | null>(null)
watch(selectedFile, (newFile) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (newFile && newFile.type.startsWith('image/')) {
    previewUrl.value = URL.createObjectURL(newFile)
  }
})

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
      formData.append('from', String(selectedDid.value ?? ''))
      formData.append('to', String(props.contact?.number ?? ''))
      formData.append('message', String(currentDraft.value || ''))
      formData.append('mms_file', file)
      formData.append('date', new Date().toISOString())
      body = formData
    }
    else {
      body = {
        from: selectedDid.value,
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

// Scroll Handling
const chatContainerRef = ref<HTMLDivElement | null>(null)

// We need to keep track of the scroll height to maintain position when loading older messages
const previousScrollHeight = ref(0)
const isPaginationLoad = ref(false)

function handleScroll() {
  const el = chatContainerRef.value
  if (!el)
    return

  if (el.scrollTop === 0 && !props.loading && props.hasMore) {
    // User scrolled to top, load older messages
    isPaginationLoad.value = true
    previousScrollHeight.value = el.scrollHeight
    emit('loadMore')
  }
}

// Watch for messages change to adjust scroll position
watch(normalizedMessages, async (newMsgs, oldMsgs) => {
  await nextTick()
  const el = chatContainerRef.value
  if (!el)
    return

  if (isPaginationLoad.value) {
    // If we just loaded older messages, restore scroll position
    const contentAddedHeight = el.scrollHeight - previousScrollHeight.value
    el.scrollTop = contentAddedHeight
    isPaginationLoad.value = false
  }
  else if (!oldMsgs || oldMsgs.length === 0 || (newMsgs.length > oldMsgs.length && newMsgs[newMsgs.length - 1]?.at !== oldMsgs[oldMsgs.length - 1]?.at)) {
    scrollToBottom()
  }
})

function scrollToBottom() {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
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
      <div ref="chatContainerRef" class="flex-1 overflow-y-auto px-4 py-3 space-y-4" style="background-image: url('/images/chat-bg.png'); background-size: cover; background-repeat: repeat;" @scroll="handleScroll">
        <!-- Pagination Loading indicator (at top) -->
        <div v-if="loading && normalizedMessages.length > 0" class="w-full flex justify-center py-2">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-[#162D3A]" />
        </div>

        <!-- Initial Loading indicator (full area) -->
        <div v-if="loading && normalizedMessages.length === 0" class="h-full w-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#162D3A]" />
        </div>

        <template v-if="normalizedMessages.length > 0">
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
      <!-- <div v-if="isUnknownContact" class="px-4 py-3 bg-[#F5EFE9CC] rounded-lg border-muted m-5">
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
      </div> -->
    </div>

    <!-- Bottom section -->
    <div>
      <!-- Footer -->
      <div class="bg-[#EBF5F3]">
        <Select v-model="selectedDid">
          <SelectTrigger class="w-full !h-9 border-none bg-transparent shadow-none focus:ring-0 px-6 justify-between flex items-center">
            <div class="flex items-center gap-1 text-sm text-muted-foreground">
              Send with
              <span class="text-primary font-medium underline underline-offset-1">
                <SelectValue>
                  {{ formatNumber(String(selectedDid)) }}
                </SelectValue>
              </span>
            </div>
            <template #icon>
              <Icon name="material-symbols:keyboard-arrow-down" size="22" class="text-muted-foreground" />
            </template>
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-if="smsDidListStatus === 'pending'" class="text-center justify-center" :value="null" disabled>
              <Icon name="eos-icons:loading" />
            </SelectItem>
            <template v-else>
              <SelectItem v-for="(option, index) in smsDidList" :key="index" :value="option.cli">
                {{ formatNumber(option.cli) }}
              </SelectItem>
            </template>
          </SelectContent>
        </Select>
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
            <BaseFileInput
              v-model="selectedFile"
              :max-size-by-type="{
                image: 3000000, // 3MB for images
                audio: 600000, // 600KB for audio
                video: 600000, // 600KB for video
                default: 600000, // 600KB for other types
              }"
              :supported-extensions="['png']"
            />
            <Button
              type="button"
              size="icon"
              :loading="loadingSms"
              :disabled="loadingSms || (!currentDraft && !selectedFile)"
              class="h-11 w-11"
              @click="sendMessage(selectedFile || undefined)"
            >
              <Icon name="material-symbols:send-outline" size="20" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
