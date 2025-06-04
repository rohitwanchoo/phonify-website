<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Define props and emits
defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  close: []
  call: [phoneNumber: string, countryCode: string]
}>()

// Reactive state
const selectedCountry = ref('us')
const phoneNumber = ref('')
const addOnDigits = ref('')
const calling = ref(false)

// Country data
const countries = [
  { value: 'us', label: 'USA & Canada', flag: '🇺🇸', code: '+1' },
]

// Get current country info
const currentCountry = computed(() =>
  countries.find(c => c.value === selectedCountry.value) || countries[0],
)

// Calculate center position
function getCenterPosition() {
  const dialerWidth = 320 // w-80 = 320px
  const dialerHeight = 600 // approximate height

  return {
    x: (window.innerWidth - dialerWidth) / 2,
    y: (window.innerHeight - dialerHeight) / 2,
  }
}

// Draggable functionality
const dialerRef = useTemplateRef<HTMLElement>('dialer')
const { x, y, style } = useDraggable(dialerRef, {
  initialValue: getCenterPosition(),
  preventDefault: true,
})

// Center the dialer when component mounts
onMounted(() => {
  const centerPos = getCenterPosition()
  x.value = centerPos.x
  y.value = centerPos.y
})

// Dialer functions
function appendDigit(digit: number | string) {
  if (!calling.value) {
    phoneNumber.value += digit.toString()
  }
  else {
    addOnDigits.value += digit.toString()
  }
}

function backspace() {
  if (calling.value) {
    if (addOnDigits.value) {
      addOnDigits.value = addOnDigits.value.slice(0, -1)
    }
    // else: do nothing (in a call and no add-on digits)
  }
  else {
    phoneNumber.value = phoneNumber.value.slice(0, -1)
  }
}

function makeCall() {
  if (phoneNumber.value.trim()) {
    calling.value = true
    emit('call', phoneNumber.value, currentCountry.value.code)
  }
}

function hangup() {
  calling.value = false
  // Reset the phone number to simulate hanging up the call
  phoneNumber.value = ''
}

function closeDialer() {
  emit('close')
}

// Digit buttons data
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
</script>

<template>
  <div
    ref="dialer"
    :style="style"
    class="fixed z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden select-none"
    style="cursor: grab;"
    @mousedown="$event.target === $el && ($el.style.cursor = 'grabbing')"
    @mouseup="$el.style.cursor = 'grab'"
  >
    <div class="w-full max-w-[326px]">
      <!-- Header -->
      <div class="relative bg-[#162D3A] text-white p-4 pb-8 flex justify-between items-center">
        <h2 class="flex-1 w-full text-sm text-center">
          Dialer
        </h2>
        <Button
          variant="ghost"
          size="sm"
          class="size-5 p-0 text-white absolute right-5"
          @click="closeDialer"
        >
          <Icon name="material-symbols:close" class="text-xl" />
        </Button>
      </div>

      <!-- Country Selection & Phone Input -->
      <div v-if="!calling" class="bg-[#162D3A] p-8 space-y-2.5">
        <!-- Country Selector -->
        <Select v-model="selectedCountry">
          <SelectTrigger class="w-full bg-[#00A08633] border-none text-white">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent class="bg-primary border-[#00A08633]">
            <SelectItem
              v-for="country in countries"
              :key="country.value"
              :value="country.value"
              class="text-white hover:bg-slate-700"
            >
              {{ country.label }}
            </SelectItem>
          </SelectContent>
        </Select>

        <!-- Phone Number Input -->
        <div class="flex items-center space-x-2 bg-[#00A08633] rounded-md px-3">
          <span class="text-white text-sm font-medium border-r pr-2.5 border-[#1F1E1C]">
            {{ currentCountry.flag }} {{ currentCountry.code }}
          </span>
          <Input
            v-model="phoneNumber"
            type="tel"
            placeholder="Enter phone number"
            class="flex-1 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 focus:outline-none p-0"
          />
        </div>
      </div>

      <!-- Calling State -->
      <div v-else class="flex flex-col items-center bg-primary px-8 pb-10">
        <div class="border border-white rounded-xl bg-[#00A086] size-[54px] flex items-center justify-center">
          <Icon name="material-symbols:person" class="text-2xl text-white" />
        </div>
        <div class="mt-4 flex flex-col items-center gap-0.5">
          <span v-if="!addOnDigits" class="text-white text-base font-semibold">{{ currentCountry.code }} {{ phoneNumber }}</span>
          <span v-else class="text-white text-base font-semibold">{{ addOnDigits }}</span>

          <span class="text-xs text-gray-300">Connecting</span>
          <span class="text-xs font-medium text-green-600">00:00:00</span>
        </div>
      </div>

      <!-- Number Pad -->
      <div class="grid grid-cols-3 px-6">
        <Button
          v-for="digit in digits.slice(0, 9)"
          :key="digit"
          variant="ghost"
          class="h-16 w-full text-lg font-normal text-[#1F1E1C] hover:bg-gray-50 border-r border-b rounded-none"
          :class="digit % 3 === 0 ? 'border-r-0' : ''"
          @click="appendDigit(digit)"
        >
          {{ digit }}
        </button>

        <Button
          variant="ghost"
          class="h-16 w-full hover:bg-white rounded-none border-r cursor-auto"
        />
        <Button
          variant="ghost"
          class="h-16 w-full text-lg font-normal text-[#1F1E1C] hover:bg-gray-50 rounded-none border-r"
          @click="appendDigit(0)"
        >
          0
        </Button>
        <Button
          variant="ghost"
          class="h-16 w-full hover:bg-white rounded-none cursor-auto"
        />
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center items-center gap-6 pt-3 pb-6 bg-white">
        <!-- Favorites Button -->
        <Button
          variant="ghost"
          size="lg"
          class="rounded-full size-[54px] p-0 hover:bg-gray-100"
        >
          <Icon name="material-symbols:favorite-outline" class="text-xl text-black" />
        </Button>

        <!-- Call Button -->
        <Button
          v-if="!calling"
          class="bg-green-600 hover:bg-green-500 rounded-full size-[54px] p-0"
          :disabled="!phoneNumber.trim()"
          @click="makeCall"
        >
          <Icon name="ion:call" class="text-2xl text-white" />
        </Button>
        <!-- Hangup Button -->
        <Button
          v-else
          class="bg-red-600 hover:bg-red-500 rounded-full size-[54px] p-0"
          @click="hangup"
        >
          <Icon name="ic:round-call-end" class="text-2xl text-white" />
        </Button>

        <!-- Backspace Button -->
        <Button
          variant="ghost"
          size="lg"
          class="rounded-full size-[54px] p-0 hover:bg-gray-100"
          :disabled="!phoneNumber"
          @click="backspace"
        >
          <Icon name="material-symbols:arrow-back" class="text-xl text-black" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure draggable cursor behavior */
.select-none {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}
</style>
