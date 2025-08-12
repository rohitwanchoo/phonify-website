export interface CallState {
  isActive: boolean
  duration: number
  startTime: number | null
  phoneNumber: string
  countryCode: string
  leadId?: string | number | null
}

export function useDialer() {
  // Global reactive state for dialer
  const isDialerOpen = useState('dialer.isOpen', () => false)
  const dialerPhoneNumber = useState('dialer.phoneNumber', () => '')
  const dialerCountryCode = useState('dialer.countryCode', () => '+1')
  const dialerLeadId = useState('dialer.leadId', () => null as string | number | null)

  // Call state management
  const callState = useState<CallState>('dialer.callState', () => ({
    isActive: false,
    duration: 0,
    startTime: null,
    phoneNumber: '',
    countryCode: '+1',
    leadId: null,
  }))

  // Timer for call duration
  const callTimer = ref<NodeJS.Timeout | null>(null)

  // Open dialer (optionally with phone number and lead info)
  const openDialer = (options?: {
    phoneNumber?: string
    countryCode?: string
    leadId?: string | number | null
  }) => {
    if (options?.phoneNumber) {
      dialerPhoneNumber.value = options.phoneNumber
    }
    if (options?.countryCode) {
      dialerCountryCode.value = options.countryCode
    }
    if (options?.leadId) {
      dialerLeadId.value = options.leadId
    }
    isDialerOpen.value = true
  }

  // Start a call
  const startCall = (phoneNumber: string, countryCode: string, leadId?: string | number | null) => {
    callState.value = {
      isActive: true,
      duration: 0,
      startTime: Date.now(),
      phoneNumber,
      countryCode,
      leadId,
    }

    // Start timer for call duration
    callTimer.value = setInterval(() => {
      if (callState.value.startTime) {
        callState.value.duration = Math.floor((Date.now() - callState.value.startTime) / 1000)
      }
    }, 1000)
  }

  // End call and cleanup
  const endCall = () => {
    if (callTimer.value) {
      clearInterval(callTimer.value)
      callTimer.value = null
    }

    callState.value = {
      isActive: false,
      duration: 0,
      startTime: null,
      phoneNumber: '',
      countryCode: '+1',
      leadId: null,
    }
  }

  // Close dialer and cleanup
  const closeDialer = () => {
    isDialerOpen.value = false
    // Clean up call state when closing dialer
    if (callState.value.isActive) {
      endCall()
    }
  }

  // Format call duration as HH:MM:SS
  const formattedCallDuration = computed(() => {
    const duration = callState.value.duration
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  // Toggle dialer
  const toggleDialer = () => {
    isDialerOpen.value = !isDialerOpen.value
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (callTimer.value) {
      clearInterval(callTimer.value)
    }
  })

  return {
    // State (readonly)
    isDialerOpen: readonly(isDialerOpen),
    dialerPhoneNumber: readonly(dialerPhoneNumber),
    dialerCountryCode: readonly(dialerCountryCode),
    dialerLeadId: readonly(dialerLeadId),
    callState: readonly(callState),
    formattedCallDuration,

    // Actions
    openDialer,
    closeDialer,
    toggleDialer,
    startCall,
    endCall,
  }
}
