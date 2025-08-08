<script setup lang="ts">
import { Button } from '~/components/ui/button'

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

// Use dialer composable
const { openDialer, closeDialer } = useDialer()

const leadId = ref(247)

const { data: leadData, status: leadDataStatus } = await useLazyAsyncData('lead-details', () =>
  useApi().get(`/lead/${leadId.value}`), {
  transform: res => res.data,
})

// Use computed instead of ref for reactive data
const data = computed(() => [
  {
    label: 'First Name',
    value: leadData.value?.first_name || 'N/A',
    copy: false,
  },
  {
    label: 'Last Name',
    value: leadData.value?.last_name || 'N/A',
    copy: false,
  },
  {
    label: 'Phone Number',
    value: formatNumber(leadData.value?.phone_number || ''),
    copy: true,
  },
  {
    label: 'Mobile',
    value: 'Rogers',
    copy: false,
  },
  {
    label: 'Email',
    value: leadData.value?.email || 'N/A',
    copy: true,
  },
  {
    label: 'Lead Source',
    value: leadData.value?.lead_source_id || 'N/A',
    copy: false,
  },
  {
    label: 'City',
    value: leadData.value?.city || 'N/A',
    copy: false,
  },
  {
    label: 'State',
    value: leadData.value?.state || 'N/A',
    copy: false,
  },
  {
    label: 'ZIp',
    value: leadData.value?.zip || 'N/A',
    copy: false,
  },
  {
    label: 'Funding Amount',
    value: `$ ${formatWithCommas(leadData.value?.funding_amount || '100000')}`,
    copy: false,
  },
  {
    label: 'Annual Revenue',
    value: `$ ${formatWithCommas(leadData.value?.annual_revenue || '520000')}`,
    copy: false,
  },
  {
    label: 'Business Type',
    value: leadData.value?.business_type || 'Construction',
    copy: false,
  },
  {
    label: 'Credit Score',
    value: leadData.value?.credit_score || '730',
    copy: false,
  },
])
</script>

<template>
  <div class="relative h-full">
    <div class="p-5 bg-gray-50 rounded-tr-lg">
      <!-- Show loading state while data is being fetched -->
      <div v-if="leadDataStatus === 'pending'" class="bg-gray-50 rounded-lg">
        <div class="border border-gray-100 rounded-lg">
          <div class="bg-[#00A086] text-white text-2xl font-medium px-5 py-3 rounded-t-lg">
            Loading...
          </div>
          <div class="bg-white p-5">
            <div class="animate-pulse space-y-4">
              <div class="h-4 bg-gray-200 rounded w-3/4" />
              <div class="h-4 bg-gray-200 rounded w-1/2" />
              <div class="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>

      <!-- Show actual data when loaded -->
      <div v-else class="border border-gray-100 rounded-lg">
        <div class="bg-[#00A086] text-white text-2xl font-medium px-5 py-3 rounded-t-lg">
          {{ leadData?.first_name }} {{ leadData?.last_name }}
        </div>
        <div class="bg-white p-5 grid grid-cols-3 gap-x-4 gap-y-3 rounded-b-lg">
          <div v-for="(item, index) in data" :key="index" class="flex flex-col gap-2">
            <span class="text-gray-500 text-xs">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-primary">{{ item.value }}</span>
              <Icon
                v-if="item.copy && item.value && item.value !== 'N/A'"
                name="material-symbols-outlined:content-copy"
                size="16"
                class="cursor-pointer"
                @click="copyToClipboard(item.value)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="mt-3 bg-white p-5 border border-gray-100 rounded-lg">
        <p class="text-base text-primary font-medium mb-3">
          Comment
        </p>
        <textarea
          class="w-full min-h-[178px] text-primary text-sm leading-[150%] p-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-0"
          placeholder="Enter your comment here..."
        />
      </div>
    </div>
    <div class="sticky bottom-0 p-5 flex gap-4 justify-between bg-white shadow-md overflow-x-auto">
      <Button variant="outline" name="transfer" class="w-full flex-1 cursor-pointer">
        <Icon name="material-symbols:sync-alt" size="20" />
        Transfer
      </Button>
      <Button variant="outline" name="voice-drop" class="w-full flex-1 cursor-pointer">
        <Icon name="material-symbols:mic" size="20" />
        Voice Drop
      </Button>
      <Button variant="outline" name="export-lead" class="w-full flex-1 cursor-pointer">
        <Icon name="material-symbols:upload-file" size="20" />
        Export Lead
      </Button>
      <Button variant="outline" name="dial-pad" class="w-full flex-1 cursor-pointer" @click="openDialer">
        <Icon name="material-symbols:dialpad" size="20" />
        Dial-pad
      </Button>
      <StartDialingLeadDetailsSelectDisposition>
        <Button variant="destructive" name="hangup" class="w-full flex-1 cursor-pointer hidden" @click="closeDialer">
          <Icon name="material-symbols:call-end" size="20" />
          Hangup
        </Button>
      </StartDialingLeadDetailsSelectDisposition>
      <Button class="w-full flex-1 cursor-pointer bg-green-600" name="call" @click="openDialer">
        <Icon name="material-symbols:call" size="20" />
        Call
      </Button>
    </div>
  </div>
</template>
