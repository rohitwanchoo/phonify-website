export function useDialer() {
  // Global reactive state for dialer
  const isDialerOpen = useState('dialer.isOpen', () => false)
  const dialerPhoneNumber = useState('dialer.phoneNumber', () => '')
  const dialerLeadId = useState('dialer.leadId', () => null as string | number | null)

  const openDialer = (options?: {
    phoneNumber?: string
    leadId?: string | number | null
  }) => {
    if (options?.phoneNumber) {
      dialerPhoneNumber.value = options.phoneNumber
    }
    if (options?.leadId) {
      dialerLeadId.value = options.leadId
    }
    isDialerOpen.value = true
  }
  const closeDialer = () => {
    isDialerOpen.value = false
    dialerPhoneNumber.value = ''
    dialerLeadId.value = null
  }

  return {
    isDialerOpen: readonly(isDialerOpen),
    dialerPhoneNumber: readonly(dialerPhoneNumber),
    openDialer,
    closeDialer,
  }
}
