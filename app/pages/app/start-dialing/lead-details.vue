<script setup lang="ts">
import { Button } from '~/components/ui/button'

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

const showDialer = ref(false)

const data = [
  {
    label: 'First Name',
    value: 'John',
    copy: false,
  },
  {
    label: 'Last Name',
    value: 'Doe',
    copy: false,
  },
  {
    label: 'Phone Number',
    value: '+1 234 567 8900',
    copy: true,
  },
  {
    label: 'Mobile',
    value: 'Rogers',
    copy: false,
  },
  {
    label: 'Email',
    value: 'johndoe@gmail.com',
    copy: true,
  },
  {
    label: 'Lead Source',
    value: 'USA Providers',
    copy: false,
  },
  {
    label: 'City',
    value: 'Houston',
    copy: false,
  },
  {
    label: 'State',
    value: 'Texas',
    copy: false,
  },
  {
    label: 'ZIp',
    value: '92987',
    copy: false,
  },
  {
    label: 'Funding Amount',
    value: '$ 1,000,000',
    copy: false,
  },
  {
    label: 'Annual Revenue',
    value: '$ 520,000',
    copy: false,
  },
  {
    label: 'Business Type',
    value: 'Construction',
    copy: false,
  },
  {
    label: 'Credit Score',
    value: '92987',
    copy: false,
  },
]
</script>

<template>
  <div class="relative">
    <div class="p-5 bg-gray-50 rounded-tr-lg">
      <div class="border border-gray-100 rounded-lg">
        <div class="bg-[#00A086] text-white text-2xl font-medium px-5 py-3 rounded-t-lg">
          John Doe
        </div>
        <div class="bg-white p-5 grid grid-cols-3 gap-x-4 gap-y-3 rounded-b-lg">
          <div v-for="(item, index) in data" :key="index" class="flex flex-col gap-2">
            <span class="text-gray-500 text-xs">{{ item.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm text-primary">{{ item.value }}</span>
              <Icon
                v-if="item.copy" name="material-symbols-outlined:content-copy" size="16" class="cursor-pointer"
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
      <Button variant="outline" name="dial-pad" class="w-full flex-1 cursor-pointer" @click="showDialer = true">
        <Icon name="material-symbols:dialpad" size="20" />
        Dial-pad
      </Button>
      <StartDialingLeadDetailsSelectDisposition />
      <Button class="w-full flex-1 cursor-pointer bg-green-600 hidden" name="call">
        <Icon name="material-symbols:call" size="20" />
        Call
      </Button>
    </div>
  </div>
  <Teleport to="body">
    <Dialer v-if="showDialer" @close="showDialer = false" />
  </Teleport>
</template>
