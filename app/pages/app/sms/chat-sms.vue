<script setup lang="ts">
import { ref } from 'vue'
import Dialer from '@/components/sms/ChatDialer.vue'
import SmsChatList from '@/components/sms/ChatList.vue'
import SmsChatSection from '@/components/sms/ChatSection.vue'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

const currentContact = ref({
  id: 1,
  title: 'Vanessa Bogan',
  number: '+1 (569) 912-3502',
  time: '10.00 am',
})

const isUnknownContact = ref(false)
const showDialer = ref(false)
const showShortDialer = ref(false)

function handleContactSelect(contact: any) {
  currentContact.value = contact
  isUnknownContact.value = contact.title === 'Unknown User' || contact.title.startsWith('+1')
}

function openDialer() {
  showDialer.value = true
  showShortDialer.value = false
}

function handleCall(phoneNumber: string, countryCode: string) {
  console.log('Calling:', countryCode, phoneNumber)
  showShortDialer.value = true
}

function handleHangup() {
  console.log('Call ended')
  showShortDialer.value = false
}

function handleClose() {
  showDialer.value = false
  showShortDialer.value = false
}
</script>

<template>
  <div>
    <BaseHeader title="Chat SMS">
      <template #actions>
        <SmsChatSheet class="bg-black text-white" />
      </template>
    </BaseHeader>

    <div>
      <ResizablePanelGroup direction="horizontal" class="h-[calc(100vh-150px)] rounded-lg border mt-4">
        <!-- Chat List -->
        <ResizablePanel :default-size="25" :min-size="16">
          <SmsChatList
            :current-contact-id="currentContact.id"
            @select-contact="handleContactSelect"
          />
        </ResizablePanel>

        <ResizableHandle with-handle />

        <!-- Chat Section -->
        <ResizablePanel :default-size="75" :min-size="50">
          <SmsChatSection
            :contact="currentContact || {
              title: 'Unknown',
              number: '+0000000000',
              time: '00:00 am',
            }"
            :is-unknown-contact="isUnknownContact"
            @open-dialer="openDialer"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>

    <Dialer
      v-if="showDialer"
      :show-short-dialer="showShortDialer"
      @call="handleCall"
      @hangup="handleHangup"
      @close="handleClose"
    />
  </div>
</template>
