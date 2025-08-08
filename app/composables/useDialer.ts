export function useDialer() {
  // Global reactive state for dialer
  const isDialerOpen = useState('dialer.isOpen', () => false)

  // Open dialer
  const openDialer = () => {
    isDialerOpen.value = true
  }

  // Close dialer
  const closeDialer = () => {
    isDialerOpen.value = false
  }

  // Toggle dialer
  const toggleDialer = () => {
    isDialerOpen.value = !isDialerOpen.value
  }

  return {
    isDialerOpen: readonly(isDialerOpen),
    openDialer,
    closeDialer,
    toggleDialer,
  }
}
