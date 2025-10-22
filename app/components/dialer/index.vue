<script setup lang="ts">
import { useDraggable, useFocus, useWindowSize } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

// Define props and emits
const props = defineProps<{
  modelValue?: boolean
}>()

const emit = defineEmits<{
  close: []
  call: [phoneNumber: string, countryCode: string, leadId?: string | number | null]
}>()
const { width } = useWindowSize()
// Use SIPml5 composable directly
const {
  callStatus,
  startCall,
  endCall,
  answerCall,
  rejectCall,
  isRegistered,
  disconnectWebphone,
  initializeSIP,
  isInitializing
} = useSIPml5()

const { isDialerOpen, dialerPhoneNumber } = useDialer()

// Ref for phone number input
const phoneNumberInput = useTemplateRef<HTMLInputElement>('phoneNumberInput')
useFocus(phoneNumberInput, { initialValue: true })

// Reactive state
const selectedCountry = ref('us')
const phoneNumber = ref(dialerPhoneNumber.value || '')
const isMinimized = ref(false)
const isConnecting = computed(() => callStatus.value === 'connecting')

const activeCall = computed(() => callStatus.value === 'active' || callStatus.value === 'ringing')
// const activeCall = computed(() => true)
const activeTab = ref<'active' | 'inactive'>('inactive')

watch(isRegistered, (newTab) => {
  if (newTab) {
    activeTab.value = 'active'
  } else {
    activeTab.value = 'inactive'
  }
})



// Connection timeout ref for cleanup
const connectionTimeout = ref<NodeJS.Timeout | null>(null)

// Watch for pre-filled phone number from composable
watch(dialerPhoneNumber, (newValue) => {
  if (newValue) {
    phoneNumber.value = newValue
  }
})

// Dialer functions
function appendDigit(digit: number | string) {
  phoneNumber.value += digit.toString()
}

function backspace() {
  phoneNumber.value = phoneNumber.value.slice(0, -1)
}

async function makeCall() {
  if (phoneNumber.value.trim()) {
    // closeDialer()
    const cleanNumber = phoneNumber.value.replace(/\D/g, '')
    if (cleanNumber.length === 5) {
      return await startCall(cleanNumber)
    }
    await startCall(`+1${cleanNumber}`)
    // closeDialer()
  }
}
// Watch for call state changes to handle auto-minimize
watch(() => callStatus.value, (newStatus) => {
  if (newStatus === 'active' || newStatus === 'ringing' || newStatus === 'incoming') {
    closeDialer()
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

// Draggable functionality
const incomingDialerRef = useTemplateRef<HTMLElement>('incomingDialer')
const { x: incomingX, y: incomingY, style: incomingStyle } = useDraggable(incomingDialerRef, {
  initialValue: getCenterPosition(),
  preventDefault: false,
})

const callInProgressDialerRef = useTemplateRef<HTMLElement>('callInProgressDialer')
const { x: callInProgressX, y: callInProgressY, style: callInProgressStyle } = useDraggable(callInProgressDialerRef, {
  initialValue: getCenterPosition(),
  preventDefault: false,
})

// Center the dialer when component mounts
onMounted(() => {
  const centerPos = getCenterPosition()
  x.value = width.value - 400
  y.value = centerPos.y

  incomingX.value = width.value - 400
  incomingY.value = centerPos.y

  // progress dialer
  callInProgressX.value = width.value - 400
  callInProgressY.value = centerPos.y
})

// Call status
const incomingCall = computed(() => callStatus.value === 'incoming')
// const incomingCall = computed(() => true)

function hangup() {
  endCall()
  closeDialer()
}

function closeDialer() {
  phoneNumber.value = ''
  // endCall()
  emit('close')
}

// Cleanup on unmount
onBeforeUnmount(() => {
  if (connectionTimeout.value) {
    clearTimeout(connectionTimeout.value)
  }
})

function onAcceptCall() {
  answerCall()
}

function handleTabChange(val: any) {
  if (val === 'inactive') {
    disconnectWebphone()
  }
  else {
    initializeSIP()
  }
}
</script>

<template>
  <!-- Incoming Call Dialer -->
  <Transition name="slide-fade">
    <div
      v-if="incomingCall"
      ref="incomingDialer"
      :style="incomingStyle"
      class="fixed z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden select-none"
      style="cursor: grab;"
      @mousedown="$event.target === incomingDialerRef && incomingDialerRef && (incomingDialerRef.style.cursor = 'grabbing')"
      @mouseup="incomingDialerRef && (incomingDialerRef.style.cursor = 'grab')"
    >
      <DialerIncoming @reject="rejectCall" @accept="onAcceptCall" />
    </div>
  </Transition>

  <!-- Active Call -->
  <Transition name="slide-side">
    <div
      v-if="activeCall"
      ref="callInProgressDialer"
      :style="callInProgressStyle"
      class="fixed z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden select-none"
      style="cursor: grab;"
      @mousedown="$event.target === callInProgressDialerRef && callInProgressDialerRef && (callInProgressDialerRef.style.cursor = 'grabbing')"
      @mouseup="callInProgressDialerRef && (callInProgressDialerRef.style.cursor = 'grab')"
    >
      <DialerCallInProgress @hangup="hangup" />
    </div>
  </Transition>

  <!-- Dialer -->
  <Transition name="slide-fade">
    <div
      v-if="isDialerOpen"
      ref="dialer"
      :style="style"
      class="fixed z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden select-none"
      style="cursor: grab;"
      @mousedown="$event.target === dialerRef && dialerRef && (dialerRef.style.cursor = 'grabbing')"
      @mouseup="dialerRef && (dialerRef.style.cursor = 'grab')"
    >
      <div class="bg-[#162D3A] px-3 pb-3 pt-2 relative text-white w-[320px]">
        <div class="absolute top-0 h-0.5 w-10 bg-white/50 left-1/2 -translate-x-1/2 cursor-pointer mt-1.5" />
        <h2 class="flex-1 w-full text-sm text-center mt-1">
          Dialer
        </h2>
        <div class="absolute right-0 top-[14px]">
          <Button
            variant="ghost"
            size="sm"
            class="size-5 p-0 text-white hover:bg-white/10 mr-2"
            @click="closeDialer"
          >
            <Icon name="material-symbols:close" class="text-md" />
          </Button>
        </div>

        <div class=" px-8 space-y-2.5 mt-14 mb-10">
          <!-- Country Selector -->
          <!-- <Switch
            v-model="isRegistered" class="data-[state=checked]:bg-green-600" @update:model-value="changeWebPhoneStatus"
          /> -->
          <div class="text-xs font-medium text-center">Webphone Status:</div>
          <Tabs v-model="activeTab" @update:model-value="handleTabChange" class="rounded-md"  >
            <TabsList class="grid w-full grid-cols-2 p-[2px]">
              <TabsTrigger :disabled="isInitializing"  class="font-normal text-xs data-[state=active]:bg-green-600 data-[state=active]:text-white" value="active">
                <Icon v-if="activeTab === 'active'" size="16" name="material-symbols:radio-button-checked-outline" class="text-md text-white"></Icon>
                
                Active 
              </TabsTrigger>
              <TabsTrigger :disabled="isInitializing" class="font-normal text-xs data-[state=active]:bg-[#E8AE24] data-[state=active]:text-white" value="inactive">
                Inactive
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
              ref="phoneNumberInput"
              v-model="phoneNumber"
              v-maska="'(###) ###-####'"
              placeholder="Enter phone number"
              class="flex-1 bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 focus-visible:ring-0 focus:outline-none p-0"
            />
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
          @click="appendDigit(0)"
        >
          0
        </Button>
        <Button
          variant="ghost"
          class="h-16 w-full hover:bg-white rounded-none cursor-auto"
        />
      </div>
      <div class="flex justify-center items-center gap-6 pt-3 pb-6 bg-white">
        <Button
          variant="ghost"
          size="lg"
          class="rounded-full size-[54px] p-0 hover:bg-gray-100"
        >
          <Icon name="material-symbols:favorite-outline" class="text-xl text-black" />
        </Button>
        <Button
          class="bg-green-600 hover:bg-green-500 rounded-full size-[54px] p-0 disabled:opacity-50"
          :disabled="!phoneNumber.trim() || isConnecting"
          @click="makeCall"
        >
          <Icon :name="isConnecting ? 'line-md:loading-twotone-loop' : 'ion:call'" class="text-2xl text-white" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          class="rounded-full size-[54px] p-0 hover:bg-gray-100 disabled:opacity-50"
          @click="backspace"
        >
          <Icon name="material-symbols:arrow-back" class="text-xl text-black" />
        </Button>
      </div>
    </div>
  </Transition>
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

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-side-enter-from,
.slide-side-leave-to {
  transform: translateX(100%);
}
.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease;
}
</style>
