<script setup lang="ts">
import { Separator } from '@/components/ui/separator'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const open = defineModel<boolean>()
</script>

<template>
  <Sheet
    v-model:open="open"
  >
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          User Details
        </SheetTitle>
      </SheetHeader>
      <div class="overflow-y-auto">
        <div class=" mx-auto p-6 space-y-6 overflow-y-auto">
          <!-- Grid Layout for Details -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Dialing Mode -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:account-outline" />
                <span class="text-sm font-normal">Full Name</span>
              </div>
              <p class="text-gray-700">
                John Doe
              </p>
            </div>

            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:extension-outline" />
                <span class="text-sm font-normal">Extension</span>
              </div>
              <p class="text-gray-700">
                John Doe
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:email-outline" />
                <span class="text-sm font-normal">Email</span>
              </div>
              <p class="text-gray-700">
                johndoe123@gmail.com
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:record-voice-over-outline" />
                <span class="text-sm font-normal">Voice Server</span>
              </div>
              <p class="text-gray-700">
                sip2.phonify.com
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:flag-outline" />
                <span class="text-sm font-normal">Country Code</span>
              </div>
              <p class="text-gray-700">
                +1
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:phone-iphone-outline" />
                <span class="text-sm font-normal">Phone</span>
              </div>
              <p class="text-gray-700">
                +1 (376) 768 4256
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:lock-outline" />
                <span class="text-sm font-normal">Enable 2FA</span>
              </div>
              <p class="text-green-600">
                Yes
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:phone-forward-outline" />
                <span class="text-sm font-normal">Phone</span>
              </div>
              <p class="text-red-600">
                No
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:person-add-outline" />
                <span class="text-sm font-normal">Follow Me</span>
              </div>
              <p class="text-green-600">
                Yes
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:logout" />
                <span class="text-sm font-normal">Allow Mobile App Login</span>
              </div>
              <p class="text-red-600">
                No
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:voice-chat-outline" />
                <span class="text-sm font-normal">Send Voicemail to Email</span>
              </div>
              <p class="text-green-600">
                Yes
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="mdi:voicemail" />
                <span class="text-sm font-normal">Voicemail</span>
              </div>
              <p class="text-red-600">
                No
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:language" />
                <span class="text-sm font-normal">IP Filtering</span>
              </div>
              <p class="text-green-600">
                Yes
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:group-outline" />
                <span class="text-sm font-normal">Twining</span>
              </div>
              <p class="text-red-600">
                No
              </p>
            </div>
          </div>

          <Separator class="bg-[#F4F4F5]" />

          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:settings-outline" />
                <span class="text-sm font-normal">CLI Settings</span>
              </div>
              <p class="text-green-600">
                Yes
              </p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:category-outline" />
                <span class="text-sm font-normal">Extension Type</span>
              </div>
              <p class="text-red-600">
                No
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
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
