import type { rechargeDetails } from '@/types/rechargeDetails'

export function useRechargeDetails() {
  // Form state
  function initialState() {
    return ref<rechargeDetails>({
      cardHolderName: '',
      cardNumber: '',
      month: 0,
      year: 0,
      cvv: '',
      amount: 0,
      address: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
    })
  }
  const formState = useState('recharge-details-state', initialState)

  // Reset function
  function resetFormState() {
    formState.value = initialState().value
  }

  return { formState, resetFormState }
}
