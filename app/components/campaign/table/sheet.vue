<script setup lang="ts">
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import moment from 'moment';

const formatTime = (time) => {
  return moment(time, 'HH:mm').format('h:mm A');
};
const open = defineModel<boolean>()
const props = defineProps({
  campaign: Object // Accept the campaign details object as a prop
})

</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="min-w-[483px]">
      <SheetHeader class="bg-[#162D3A] ">
        <SheetTitle class="text-white">
          Campaign Details
        </SheetTitle>
      </SheetHeader>
      <div>
        <div class="mx-auto p-6 space-y-6">
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.3967 6.73648H11.9634C11.8256 6.73648 11.7091 6.69017 11.6139 6.59755C11.5187 6.50505 11.4711 6.39017 11.4711 6.25292C11.4711 6.11567 11.5176 5.99948 11.6106 5.90436C11.7036 5.80911 11.819 5.76148 11.9569 5.76148H13.3901C13.5281 5.76148 13.6447 5.8078 13.7398 5.90042C13.8351 5.99292 13.8827 6.1078 13.8827 6.24505C13.8827 6.3823 13.8362 6.49848 13.7432 6.59361C13.6502 6.68886 13.5347 6.73648 13.3967 6.73648ZM10.5004 9.93411C10.584 9.82736 10.6912 9.76073 10.8221 9.73423C10.9529 9.70786 11.0716 9.73023 11.1784 9.80136L12.3508 10.6123C12.4692 10.689 12.5416 10.799 12.5679 10.9423C12.5944 11.0855 12.5658 11.2105 12.4821 11.3173C12.3984 11.4239 12.2913 11.4905 12.1605 11.517C12.0298 11.5435 11.911 11.5211 11.8043 11.4499L10.6316 10.6391C10.5134 10.5624 10.4411 10.4524 10.4147 10.3091C10.3882 10.1659 10.4168 10.0409 10.5004 9.93411ZM12.3206 1.8298L11.1308 2.66773C11.024 2.73886 10.9021 2.75811 10.7651 2.72548C10.6281 2.69273 10.524 2.62298 10.4528 2.51623C10.3816 2.40961 10.3593 2.28773 10.3858 2.15061C10.4122 2.01361 10.4788 1.90955 10.5855 1.83842L11.7754 1.01923C11.8821 0.948109 12.004 0.925733 12.141 0.952108C12.278 0.978608 12.3821 1.04517 12.4534 1.1518C12.5245 1.25855 12.5468 1.38042 12.5203 1.51742C12.4939 1.65455 12.4274 1.75867 12.3206 1.8298ZM1.78744 7.73173H1.323C0.99025 7.73173 0.706125 7.61392 0.470625 7.3783C0.235 7.1428 0.117188 6.85867 0.117188 6.52592V5.97205C0.117188 5.6393 0.235 5.35517 0.470625 5.11967C0.706125 4.88405 0.99025 4.76623 1.323 4.76623H3.82838L6.6855 3.09036C6.8865 2.96723 7.08625 2.9598 7.28475 3.06805C7.48338 3.17617 7.58269 3.34705 7.58269 3.58067V8.89855C7.58269 9.13217 7.48025 9.30305 7.27538 9.41117C7.07063 9.51942 6.86775 9.51198 6.66675 9.38886L3.94088 7.73173H3.21244V10.5405C3.21244 10.742 3.14419 10.9122 3.00769 11.051C2.87131 11.19 2.70206 11.2595 2.49994 11.2595C2.29781 11.2595 2.12856 11.1913 1.99219 11.0548C1.85569 10.9184 1.78744 10.7492 1.78744 10.547V7.73173ZM6.60769 8.2063V4.25417L4.10231 5.74123H1.323C1.26538 5.74123 1.2125 5.7653 1.16438 5.81342C1.11625 5.86155 1.09219 5.91442 1.09219 5.97205V6.52592C1.09219 6.58355 1.11625 6.63642 1.16438 6.68455C1.2125 6.73267 1.26538 6.75673 1.323 6.75673H4.23356L6.60769 8.2063ZM8.77106 8.26967V4.2283C9.01531 4.46967 9.20231 4.77086 9.33206 5.13186C9.46194 5.49298 9.52688 5.86536 9.52688 6.24898C9.52688 6.63261 9.46194 7.00498 9.33206 7.36611C9.20231 7.72711 9.01531 8.0283 8.77106 8.26967Z" fill="#162D3A" fill-opacity="0.8" />
                </svg>
                <span class="text-sm font-normal">Name</span>
              </div>
              <div class="text-[16px] font-medium">
              {{campaign?.title}}
            </div>
          </div>

          <!-- Description Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <Icon name="lucide:file-text" />
              <span class="text-sm font-normal">Description</span>
            </div>
            <p class="text-gray-700">
              {{ campaign?.description }}
            </p>
          </div>

          <!-- Grid Layout for Details -->
          <div class="grid grid-cols-2 gap-6">
            <!-- Dialing Mode -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="ic:outline-local-phone" />
                <span class="text-sm font-normal">Dialing Mode</span>
              </div>
              <p class="text-gray-700">
                {{ campaign?.dial_mode}}
              </p>
            </div>

            <!-- Status -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="lucide:zap" />
                <span class="text-sm font-normal">Status</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.status == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.status == 1 ? 'Active' : 'Inactive' }}
</p>
            </div>

            <!-- Time based calling -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="material-symbols:clock-loader-60" />
                <span class="text-sm font-normal">Time based calling</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.status == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.status == 1 ?  'Yes' : 'No'}}
</p>
            </div>

            <!-- Call Time -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:clock-4" />
                <span class="text-sm font-normal">Call Time</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
  {{ formatTime(campaign?.call_time_start) }} to {{ formatTime(campaign?.call_time_end) }}
</p>
            </div>

            <!-- Caller ID -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="clarity:user-line" />
                <span class="text-sm font-normal">Caller ID</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{campaign?.caller_id}}
              </p>
            </div>

            <!-- Custom Caller ID -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:user-round-cog" />
                <span class="text-sm font-normal">Custom Caller ID</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{campaign?.custom_caller_id}}
              </p>
            </div>

            <!-- Country Code -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <Icon name="lucide:flag" />
                <span class="text-sm font-normal">Country Code</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                {{campaign?.country_code}}
              </p>
            </div>

            <!-- List Associated -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:list" />
                <span class="text-sm font-normal">List Associated</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                2
              </p>
            </div>

            <!-- Send to CRM -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:rocket" />
                <span class="text-sm font-normal">Send to CRM</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.send_crm == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.send_crm == 1 ?  'Yes' : 'No'}}
</p>
            </div>

            <!-- Dialed Leads/Total Leads -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="gravity-ui:nodes-down" />
                <span class="text-sm font-normal">Dialed Leads/Total Leads</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                908/8725
              </p>
            </div>

            <!-- Send Email -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:mail" />
                <span class="text-sm font-normal">Send Email</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.email == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.email == 1 ? 'With user email' : 'No'}}
</p>
            </div>

            <!-- Send SMS -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:message-square-text" />

                <span class="text-sm font-normal">Send SMS</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.sms == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.sms == 1 ? 'With user phone number' : 'No'}}
</p>
            </div>

            <!-- Hopper Count -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="material-symbols-light:filter-alt-outline" />

                <span class="text-sm font-normal">Hopper Count</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                0
              </p>
            </div>

            <!-- Created Date -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="lucide:calendar-days" />
                <span class="text-sm font-normal">Created Date</span>
              </div>
              <p class="text-gray-700 text-[16px] font-normal">
                01/05/2025 12:00 PM
              </p>
            </div>

            <!-- Send Report -->
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-gray-600">
                <icon name="icon-park-solid:notepad" />
                <span class="text-sm font-normal ">Send Report</span>
              </div>
              <p
  :class="[
    'font-medium text-[16px]',
    campaign?.send_report == 1 ? 'text-green-600' : 'text-red-600'
  ]"
>
  {{ campaign?.send_report == 1 ? 'Yes' : 'No'}}
</p>
            </div>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
