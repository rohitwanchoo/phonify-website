<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Button from '@/components/ui/button/Button.vue'

const emits = defineEmits(['hangup'])

const { callerDetails, callStatus, callDuration } = useSIPml5()
const minimize = ref(true)

// Format phone number for display
function formatPhoneNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return number
}

function appendDigit(digit: number) {
  return digit
}

const formattedCallDuration = computed(() => {
  const totalSeconds = Math.floor(callDuration.value)
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
})
</script>

<template>
  <div v-if="minimize" class="flex flex-col items-center bg-[#162D3A] px-3 ">
    <div class="h-0.5 w-10 bg-white/50 mb-4 mt-1 mx-auto cursor-pointer" @click="minimize = !minimize" />
    <div class="flex items-center justify-between w-full">
      <div class="flex gap-x-3">
        <div class="bg-[#00A086] rounded-full size-12 text-white flex items-center justify-center">
          <div class="font-bold text-[18px]">
            CN
          </div>
        </div>
        <div>
          <div class="text-white font-medium text-[16px]">
            {{ callerDetails?.name || callerDetails?.number || 'Jhon Doe' }}
          </div>
          <div class="text-[#FFFFFFB2] text-nowrap">
            {{ callStatus === 'active' ? 'Call in progress' : '' }} - {{ formattedCallDuration }}
          </div>
        </div>
      </div>
      <div>
        <Button variant="ghost" class="hover:bg-transparent group" size="icon" @click="minimize = false">
          <Icon class="text-white group-hover:scale-105 transition-transform duration-200 ease-linear" size="20" name="ep:full-screen" />
        </Button>
      </div>
    </div>
    <div class="flex w-full gap-x-2 my-[16px]">
      <Button variant="default" class="bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/70 h-[44px] flex-1" @click="minimize = !minimize">
        <Icon name="material-symbols:dialpad" class="text-xl" />
      </Button>
      <Button variant="default" class="bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/70 h-[44px] flex-1">
        <Icon name="material-symbols:pause" class="text-xl" />
      </Button>
      <Button variant="default" class="bg-[#FFFFFF1A] hover:bg-[#FFFFFF1A]/70 h-[44px] flex-1">
        <Icon name="material-symbols:mic-off" class="text-xl" />
      </Button>
      <Button variant="default" class="bg-red-600 hover:bg-red-600/80 h-[44px] flex-1" @click="emits('hangup')">
        <Icon name="material-symbols:call-end" class="text-xl" />
      </Button>
    </div>
  </div>

  <div v-else>
    <div class="flex flex-col items-center bg-[#162D3A] px-8 pb-10">
      <div class="h-0.5 w-10 bg-white/50 mb-4 mt-1 mx-auto cursor-pointer" @click="minimize = !minimize" />

      <div class="border border-white rounded-xl bg-[#00A086] size-[54px] flex items-center justify-center mb-4 mt-12 ">
        <Icon name="material-symbols:person" class="text-2xl text-white" />
      </div>
      <div class="text-center space-y-1">
        <div class="text-white text-base font-semibold">
          {{ formatPhoneNumber(callerDetails.number) }}
        </div>
        <div class="text-xs text-gray-300">
          {{ callStatus === 'connecting' ? 'connecting...' : callStatus === 'ringing' ? 'ringing...' : '' }}
        </div>
        <div v-if="callStatus === 'active'" class="text-xs font-medium text-green-600">
          {{ formattedCallDuration }}
        </div>
        <div v-else-if="callStatus === 'connecting'" class="text-xs font-medium text-yellow-400">
          Please wait...
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 px-6">
      <Button
        v-for="digit in 9"
        :key="digit"
        variant="ghost"
        class="h-16 w-full text-lg font-normal text-[#1F1E1C] hover:bg-gray-50 border-r border-b rounded-none"
        :class="digit % 3 === 0 ? 'border-r-0' : ''"
        @click="appendDigit(digit)"
      >
        {{ digit }}
      </Button>

      <Button
        variant="ghost"
        class="h-16 w-full hover:bg-white rounded-none border-r cursor-auto"
      />
      <Button
        variant="ghost"
        class="h-16 w-full text-lg font-normal text-[#1F1E1C] hover:bg-gray-50 rounded-none border-r"
      >
        0
      </Button>
      <Button
        variant="ghost"
        class="h-16 w-full hover:bg-white rounded-none cursor-auto"
      />
    </div>
    <div class="flex justify-between items-center px-6 pt-3 pb-6">
      <Button
        variant="ghost"
        size="lg"
        class="rounded-full size-[54px] p-0 hover:bg-gray-100"
      >
        <Icon name="material-symbols:mic-outline" class="text-xl text-black" />
      </Button>

      <Button

        class="bg-red-600 hover:bg-red-500 rounded-full size-[54px] p-0"
        @click="emits('hangup')"
      >
        <Icon name="ic:round-call-end" class="text-2xl text-white" />
      </Button>

      <Button
        variant="ghost"
        size="lg"
        class="rounded-full size-[54px] p-0 hover:bg-gray-100 disabled:opacity-50"
      >
        <Icon name="material-symbols:arrow-back" class="text-xl text-black" />
      </Button>
    </div>
  </div>
</template>
