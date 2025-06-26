<script setup lang="ts">
import type { Extension } from '~/types/extension'
import { Separator } from '@/components/ui/separator'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const props = defineProps<{
  data: Extension
}>()
const open = defineModel<boolean>()

const enable_2fa = computed(() => {
  return props?.data?.enable_2fa !== '0'
})

const ip_filtering = computed(() => {
  return props?.data?.ip_filtering !== '0'
})

const twinning = computed(() => {
  return props?.data?.twinning !== '0'
})

const extensionType = computed(() => {
  return props?.data?.extension_type !== '0'
})
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetContent class="w-full md:min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          User Details
        </SheetTitle>
      </SheetHeader>
      <div class="overflow-y-auto">
        <div class=" mx-auto p-6 space-y-6 overflow-y-auto">
          <!-- Grid Layout for Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Dialing Mode -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:account-outline" />
                <span class="text-sm font-normal">Full Name</span>
              </div>
              <p class="text-gray-700">
                {{ data?.first_name }} {{ data?.last_name }}
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:extension-outline" />
                <span class="text-sm font-normal">Extension</span>
              </div>
              <p class="text-gray-700">
                {{ data?.extension }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:email-outline" />
                <span class="text-sm font-normal">Email</span>
              </div>
              <p class="text-gray-700">
                {{ data?.email }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:record-voice-over-outline" />
                <span class="text-sm font-normal">Voice Server</span>
              </div>
              <p class="text-gray-700">
                {{ data?.serverList[0]?.domain }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:flag-outline" />
                <span class="text-sm font-normal">Country Code</span>
              </div>
              <p class="text-gray-700">
                + {{ data?.country_code }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:phone-iphone-outline" />
                <span class="text-sm font-normal">Phone</span>
              </div>
              <p class="text-gray-700">
                {{ formatNumber(data?.mobile) }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:lock-outline" />
                <span class="text-sm font-normal">Enable 2FA</span>
              </div>
              <p :class="[enable_2fa ? 'text-green-500' : 'text-red-600']">
                {{ enable_2fa ? 'Yes' : 'No' }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:phone-forward-outline" />
                <span class="text-sm font-normal">Call Forward</span>
              </div>
              <p :class="data.call_forward ? 'text-green-600' : 'text-red-600'">
                {{ data.call_forward ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:person-add-outline" />
                <span class="text-sm font-normal">Follow Me</span>
              </div>
              <p :class="data?.follow_me ? 'text-green-600' : 'text-red-600'">
                {{ data.follow_me ? 'Yes' : 'No' }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:logout" />
                <span class="text-sm font-normal">Allow Mobile App Login</span>
              </div>
              <p class="text-red-600">
                <!-- TODO: cant find field -->
                No
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:voice-chat-outline" />
                <span class="text-sm font-normal">Send Voicemail to Email</span>
              </div>
              <p :class="data?.voicemail_send_to_email ? 'text-green-600' : 'text-red-600'">
                {{ data?.voicemail_send_to_email ? 'yes' : 'No' }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:voicemail" />
                <span class="text-sm font-normal">Voicemail</span>
              </div>
              <p :class="data?.voicemail ? 'text-green-600' : 'text-red-600'">
                {{ data?.voicemail ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:language" />
                <span class="text-sm font-normal">IP Filtering</span>
              </div>
              <p :class="ip_filtering ? 'text-green-600' : 'text-red-600'">
                {{ ip_filtering ? 'Yes' : 'No' }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:group-outline" />
                <span class="text-sm font-normal">Twining</span>
              </div>
              <p :class="twinning ? 'text-green-600' : 'text-red-600'">
                {{ twinning ? 'Yes' : 'No' }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:settings-outline" />
                <span class="text-sm font-normal">CLI Settings</span>
              </div>
              <p :class=" data?.cli_setting ? 'text-green-600' : 'text-red-600'">
                {{ data?.cli_setting ? 'Yes' : 'No' }}
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:category-outline" />
                <span class="text-sm font-normal">Extension Type</span>
              </div>
              <p :class="extensionType ? 'text-green-600' : 'text-red-600'">
                {{ extensionType ? "Yes" : "No" }}
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-1 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:settings-outline" />
                <span class="text-sm font-normal">Forward Incoming SMS to</span>
              </div>
              <p class="text-green-600">
                Yes
                <!-- TODO: cant find field -->
              </p>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
