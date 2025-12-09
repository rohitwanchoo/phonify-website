<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ref, watch } from 'vue'
import Dialer from '@/components/dialer/index.vue'
import SmsChatList from '@/components/sms/ChatList.vue'
import SmsChatSection from '@/components/sms/ChatSection.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

const route = useRoute()

const start = ref(0)
const limit = ref(10)
const search = ref('')

const currentContact = ref(
  route.query.number
    ? {
        number: Number(route.query.number),
        did: Number(route.query.did),
      }
    : undefined,
)

const chatMessageStart = ref(0)
const chatMessageLimit = ref(10)

const showDialer = ref(false)
const showShortDialer = ref(false)

const { data: smsListResponse, status: smsListStatus, refresh: refreshSmsList } = await useLazyAsyncData('sms-list', () =>
  useApi().get('sms', {
    query: {
      start: start.value,
      limit: limit.value,
      search: search.value,
    },
  }), {
  transform: res => res.data,
  immediate: true,
})

const smsList = ref<{ data: any[], total: number }>({ data: [], total: 0 })

watch(smsListResponse, (newVal) => {
  if (newVal) {
    if (start.value === 0) {
      smsList.value = { data: newVal.data || [], total: newVal.total || 0 }
    }
    else {
      smsList.value.data.push(...(newVal.data || []))
      smsList.value.total = newVal.total || 0
    }
  }
})

const { data: smsChats, status: smsChatsStatus, refresh: refreshSmsChats } = await useLazyAsyncData('sms-chats', () =>
  useApi().get('sms-by-did', {
    query: {
      start: chatMessageStart.value,
      limit: chatMessageLimit.value,
      number: currentContact.value?.number,
      did: currentContact.value?.did,
    },
  }), {
  transform: res => res.data,
  immediate: true,
})

const allMessages = ref<any[]>([])
const hasMoreMessages = ref(true)

watch(smsChats, (newVal) => {
  if (newVal) {
    if (newVal.length < chatMessageLimit.value) {
      hasMoreMessages.value = false
    }
    // Reverse the chunk to get chronological order (Oldest -> Newest)
    // because API returns Newest -> Oldest
    const newMessages = [...(newVal || [])].reverse()

    if (chatMessageStart.value === 0) {
      // Initial load or refresh (newest messages)
      allMessages.value = newMessages
    }
    else {
      // Pagination (older messages)
      // Since we are reversing, the 'older' messages (which are chronologically earlier)
      // should come BEFORE the current messages.
      allMessages.value = [...newMessages, ...allMessages.value]
    }
  }
})

// Watch for contact changes and refresh chats
watch(currentContact, (newContact) => {
  if (newContact) {
    chatMessageStart.value = 0
    allMessages.value = [] // clear previous chat
    hasMoreMessages.value = true
    refreshSmsChats()
  }
})

function loadOlderMessages() {
  if (!hasMoreMessages.value || smsChatsStatus.value === 'pending')
    return

  chatMessageStart.value += chatMessageLimit.value
  refreshSmsChats()
}

// Auto-select the first contact once the SMS list loads
const stopAutoSelect = watch(smsList, (list) => {
  const first = list?.data?.[0]
  if (!currentContact.value && first) {
    currentContact.value = first
    // Stop watching after initial selection to avoid overriding user choice
    stopAutoSelect()
  }
}, { immediate: true })

function handleContactSelect(contact: any) {
  currentContact.value = contact
}

function openDialer() {
  showDialer.value = true
  showShortDialer.value = false
}

function handleCall(_phoneNumber: string, _countryCode: string) {
  showShortDialer.value = true
}

function handleHangup() {
  showShortDialer.value = false
}

function handleClose() {
  showDialer.value = false
  showShortDialer.value = false
}

function changePage(newStart: number) {
  start.value = newStart
  return refreshSmsList()
}

function changeLimit(val: number) {
  limit.value = Number(val)
  return refreshSmsList()
}

const debouncedSearch = useDebounceFn(() => {
  start.value = 0
  refreshSmsList()
}, 1000, { maxWait: 5000 })

function searchText() {
  debouncedSearch()
}
</script>

<template>
  <div>
    <BaseHeader title="Chat SMS">
      <template #actions>
        <SmsChatSheet class="bg-black text-white" />
      </template>
    </BaseHeader>

    <ResizablePanelGroup direction="horizontal" class="h-full max-h-[calc(100vh-168px)] rounded-lg border mt-4">
      <!-- Chat List -->
      <ResizablePanel :default-size="45" :min-size="20">
        <SmsChatList
          :limit="limit"
          :start="start"
          :total-rows="smsList?.total || 0"
          :sms-chat-list="smsList?.data || []"
          :loading="smsListStatus === 'pending'"
          :search="search"
          :refresh="refreshSmsList"
          :selected-contact="currentContact"
          @select-contact="handleContactSelect"
          @search-text="searchText"
          @update:search="search = $event"
          @change-page="changePage"
          @change-limit="changeLimit"
        />
      </ResizablePanel>

      <ResizableHandle with-handle />

      <!-- Chat Section -->
      <ResizablePanel :default-size="75" :max-size="78" :min-size="30">
        <SmsChatSection
          :contact="currentContact || {}"
          :messages="allMessages"
          :loading="smsChatsStatus === 'pending'"
          :has-more="hasMoreMessages"
          @open-dialer="openDialer"
          @load-more="loadOlderMessages"
        />
      </ResizablePanel>
    </ResizablePanelGroup>

    <Dialer
      v-if="showDialer"
      :show-short-dialer="showShortDialer"
      @call="handleCall"
      @hangup="handleHangup"
      @close="handleClose"
    />
  </div>
</template>
