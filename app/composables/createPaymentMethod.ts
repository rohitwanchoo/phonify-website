export function useCreatePaymentMethod() {
  // Form state
  function initialState() {
    return ref({
      id: '',
      full_name: '',
      number: '',
      exp_month: 0,
      exp_year: 0,
      cvc: '',
      country: '',
      city: '',
      postal_code: '',
      state: '',
      line1: '',
    })
  }
  const formState = useState('create-payment-method-state', initialState)

  // Reset function
  function resetFormState() {
    formState.value = initialState().value
  }

  return { formState, resetFormState }
}
