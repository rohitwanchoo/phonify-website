<script setup lang="ts">
import { useDraggable } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Define props and emits
defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  close: []
  call: [phoneNumber: string, countryCode: string, leadId?: string | number | null]
}>()

// Use enhanced dialer composable
const {
  dialerPhoneNumber,
  callState,
  formattedCallDuration,
  startCall,
  endCall,
} = useDialer()

// Reactive state
const selectedCountry = ref('us')
const phoneNumber = ref(dialerPhoneNumber.value || '')
const addOnDigits = ref('')
const isMinimized = ref(false)
const isConnecting = ref(false)
const showNumberPad = ref(false)

// Connection timeout ref for cleanup
const connectionTimeout = ref<NodeJS.Timeout | null>(null)

// Watch for pre-filled phone number from composable
watch(dialerPhoneNumber, (newValue) => {
  if (newValue) {
    phoneNumber.value = newValue
  }
})

// Watch for call state changes to handle auto-minimize
watch(() => callState.value.isActive, (isActive, wasActive) => {
  if (isActive && !wasActive) {
    // Call just became active (connected)
    isConnecting.value = false

    // Auto-minimize after connection
    setTimeout(() => {
      isMinimized.value = true
      showNumberPad.value = false
    }, 500) // Small delay to show connected state
  }
  else if (!isActive && wasActive) {
    // Call ended
    isMinimized.value = false
    showNumberPad.value = false
    isConnecting.value = false

    // Clear any pending timeout
    if (connectionTimeout.value) {
      clearTimeout(connectionTimeout.value)
      connectionTimeout.value = null
    }
  }
})

// Country data
const countries = [
  { value: 'us', label: 'USA & Canada', flag: '🇺🇸', code: '+1' },
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { value: 'ca', label: 'Canada', flag: '🇨🇦', code: '+1' },
]

// Get current country info
const currentCountry = computed(() =>
  countries.find(c => c.value === selectedCountry.value) || countries[0],
)

// Calculate center position
function getCenterPosition() {
  const dialerWidth = 320 // w-80 = 320px
  const dialerHeight = isMinimized.value ? 180 : 600 // approximate height

  return {
    x: (window.innerWidth - dialerWidth) / 2,
    y: (window.innerHeight - dialerHeight) / 2,
  }
}

// Draggable functionality
const dialerRef = useTemplateRef<HTMLElement>('dialer')
const { x, y, style } = useDraggable(dialerRef, {
  initialValue: getCenterPosition(),
  preventDefault: false,
})

// Center the dialer when component mounts
onMounted(() => {
  const centerPos = getCenterPosition()
  x.value = centerPos.x
  y.value = centerPos.y
})

// Dialer functions
function appendDigit(digit: number | string) {
  if (!callState.value.isActive) {
    phoneNumber.value += digit.toString()
  }
  else {
    addOnDigits.value += digit.toString()
    // In a real app, you might send DTMF tones here
  }
}

function backspace() {
  if (callState.value.isActive) {
    if (addOnDigits.value) {
      addOnDigits.value = addOnDigits.value.slice(0, -1)
    }
  }
  else {
    phoneNumber.value = phoneNumber.value.slice(0, -1)
  }
}

function makeCall() {
  if (phoneNumber.value.trim()) {
    const cleanNumber = phoneNumber.value.replace(/\D/g, '')

    // Clear any existing timeout
    if (connectionTimeout.value) {
      clearTimeout(connectionTimeout.value)
      connectionTimeout.value = null
    }

    // Set connecting state
    isConnecting.value = true

    // Start the call timer and state
    startCall(cleanNumber, currentCountry.value?.code || '+1')
    emit('call', cleanNumber, currentCountry.value?.code || '+1')

    // Set timeout for connection simulation
    // In real app, this would be handled by actual call connection events
    connectionTimeout.value = setTimeout(() => {
      if (isConnecting.value) {
        // Simulate call connection - this triggers the watcher above
        // In real implementation, your call service would update callState.isActive
        isConnecting.value = false

        // If your useDialer composable doesn't automatically set isActive to true,
        // you may need to handle this differently based on your call service
      }
    }, 3000)
  }
}

function hangup() {
  // Clear connection timeout
  if (connectionTimeout.value) {
    clearTimeout(connectionTimeout.value)
    connectionTimeout.value = null
  }

  endCall()
  addOnDigits.value = ''
  isConnecting.value = false
  showNumberPad.value = false
  isMinimized.value = false
}

function closeDialer() {
  if (callState.value.isActive || isConnecting.value) {
    hangup()
  }
  emit('close')
}

function toggleMinimize() {
  isMinimized.value = !isMinimized.value
  if (!isMinimized.value) {
    showNumberPad.value = false
  }
}

function toggleNumberPad() {
  if (isMinimized.value && callState.value.isActive) {
    showNumberPad.value = !showNumberPad.value
  }
}

// Format phone number for display
function formatPhoneNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return number
}

// Digit buttons data
const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Computed property for current call status display
const callStatusText = computed(() => {
  if (isConnecting.value)
    return 'Connecting...'
  if (callState.value.isActive)
    return `Call in progress - ${formattedCallDuration.value}`
  return 'Ready to call'
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (connectionTimeout.value) {
    clearTimeout(connectionTimeout.value)
  }
})
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
    <div
      class="w-full max-w-[326px] duration-300 transition-all"
      :class="[isMinimized && !showNumberPad ? 'max-h-[180px]' : 'max-h-[600px]']"
    >
      <!-- Minimized Dialer -->
      <div v-if="isMinimized && !showNumberPad" class="bg-[#162D3A] px-3 pb-3 pt-2">
        <div class="h-0.5 w-10 bg-white/50 mb-4 mx-auto cursor-pointer" @click="toggleMinimize" />
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-start gap-3">
            <div class="size-12 rounded-full bg-[#00A086] flex items-center justify-center">
              <Icon name="material-symbols:person" class="text-white text-xl" />
            </div>
            <div>
              <p class="text-white text-base font-medium">
                {{ formatPhoneNumber(callState.phoneNumber || phoneNumber) }}
              </p>
              <p class="text-white/70 text-xs font-medium">
                {{ callStatusText }}
              </p>
            </div>
          </div>
          <Icon
            name="material-symbols:crop-free"
            class="text-xl text-white cursor-pointer hover:text-gray-300"
            @click="toggleMinimize"
          />
        </div>
        <div class="flex items-center gap-2 w-full">
          <Button
            variant="ghost"
            class="flex-1 h-11 bg-white/10 text-white hover:bg-white/20"
            :disabled="!callState.isActive"
            @click="toggleNumberPad"
          >
            <Icon name="material-symbols:dialpad" class="text-xl" />
          </Button>
          <Button
            variant="ghost"
            class="flex-1 h-11 bg-white/10 text-white hover:bg-white/20"
            :disabled="!callState.isActive"
          >
            <Icon name="material-symbols:pause" class="text-xl" />
          </Button>
          <Button
            variant="ghost"
            class="flex-1 h-11 bg-white/10 text-white hover:bg-white/20"
            :disabled="!callState.isActive"
          >
            <Icon name="material-symbols:mic-off" class="text-xl" />
          </Button>
          <Button
            class="bg-red-600 hover:bg-red-500 h-11 flex-1"
            @click="(callState.isActive || isConnecting) ? hangup() : closeDialer()"
          >
            <Icon
              :name="(callState.isActive || isConnecting) ? 'ic:round-call-end' : 'material-symbols:close'"
              class="text-xl text-white"
            />
          </Button>
        </div>
      </div>

      <!-- Full Dialer or Number Pad -->
      <div v-else>
        <div class="bg-[#162D3A] h-[254px] flex flex-col pt-2 justify-between">
          <!-- Header -->
          <div class="relative text-white p-4 pb-8 flex justify-between items-center">
            <div class="absolute top-0 h-0.5 w-10 bg-white/50 left-1/2 -translate-x-1/2 cursor-pointer" @click="toggleMinimize" />
            <h2 class="flex-1 w-full text-sm text-center">
              {{
                callState.isActive
                  ? (showNumberPad ? 'Number Pad' : 'In Call')
                  : (isConnecting ? 'Connecting' : 'Dialer')
              }}
            </h2>
            <div class="absolute left-5">
              <Button
                v-if="showNumberPad"
                variant="ghost"
                size="sm"
                class="size-5 p-0 text-white hover:bg-white/10 mr-2"
                @click="showNumberPad = false"
              >
                <Icon name="material-symbols:arrow-back" class="text-xl" />
              </Button>
            </div>
            <div class="absolute right-5">
              <Button
                variant="ghost"
                size="sm"
                class="size-5 p-0 text-white hover:bg-white/10"
                @click="closeDialer"
              >
                <Icon name="material-symbols:close" class="text-xl" />
              </Button>
            </div>
          </div>

          <!-- Country Selection & Phone Input (when not in call or connecting) -->
          <div v-if="!callState.isActive && !showNumberPad && !isConnecting" class="bg-[#162D3A] p-8 space-y-2.5">
            <!-- Country Selector -->
            <Select v-model="selectedCountry">
              <SelectTrigger class="w-full bg-[#00A08633] border-none text-white">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent class="bg-[#162D3A] border-[#00A08633]">
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
            <div class="flex h-10 items-center space-x-2 bg-[#00A08633] rounded-md px-3">
              <span class="text-white text-sm font-medium border-r pr-2.5 border-[#1F1E1C]">
                <span class="rounded-full">
                  {{ currentCountry?.flag }}
                </span>
                {{ currentCountry?.code }}
              </span>
              <Input
                v-model="phoneNumber"
                v-maska="'(###) ###-####'"
                placeholder="Enter phone number"
                class="flex-1 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 focus-visible:ring-0 focus:outline-none p-0"
              />
            </div>
          </div>

          <!-- Active Call State or Connecting -->
          <div v-else-if="(callState.isActive || isConnecting) && !showNumberPad" class="flex flex-col items-center bg-[#162D3A] px-8 pb-10">
            <div class="border border-white rounded-xl bg-[#00A086] size-[54px] flex items-center justify-center mb-4">
              <Icon name="material-symbols:person" class="text-2xl text-white" />
            </div>
            <div class="text-center space-y-1">
              <div class="text-white text-base font-semibold">
                {{ currentCountry?.code }} {{ formatPhoneNumber(phoneNumber) }}
              </div>
              <div class="text-xs text-gray-300">
                {{ isConnecting ? 'Connecting...' : 'Connected' }}
              </div>
              <div v-if="callState.isActive" class="text-xs font-medium text-green-600">
                {{ formattedCallDuration }}
              </div>
              <div v-else-if="isConnecting" class="text-xs font-medium text-yellow-400">
                Please wait...
              </div>
            </div>
          </div>

          <!-- Number Pad Header (when in number pad mode during call) -->
          <div v-else-if="showNumberPad" class="flex flex-col items-center bg-[#162D3A] px-8 pb-6">
            <div class="text-center space-y-1">
              <div class="text-white text-lg font-semibold">
                {{ addOnDigits || 'Enter digits' }}
              </div>
              <div class="text-xs text-gray-300">
                Additional digits to send
              </div>
            </div>
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
          </Button>

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
            :disabled="callState.isActive || isConnecting"
          >
            <Icon name="material-symbols:favorite-outline" class="text-xl text-black" />
          </Button>

          <!-- Call/Hangup Button -->
          <Button
            v-if="!callState.isActive && !isConnecting"
            class="bg-green-600 hover:bg-green-500 rounded-full size-[54px] p-0 disabled:opacity-50"
            :disabled="!phoneNumber.trim()"
            @click="makeCall"
          >
            <Icon name="ion:call" class="text-2xl text-white" />
          </Button>
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
            class="rounded-full size-[54px] p-0 hover:bg-gray-100 disabled:opacity-50"
            :disabled="callState.isActive ? !addOnDigits : !phoneNumber"
            @click="backspace"
          >
            <Icon name="material-symbols:arrow-back" class="text-xl text-black" />
          </Button>
        </div>
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
