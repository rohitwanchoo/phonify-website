import { CampaignCreate, CampaignPreview, CampaignSelectList } from '#components'
import { useStepper } from '@vueuse/core'

export function useCreateCampaign() {
  // Form state
  function initialState() {
    return ref({
      name: '',
    })
  }
  const formState = useState('create-campaign-state', initialState)

  // Reset function
  function resetFormState() {
    formState.value = initialState().value
  }

  // Stepper configuration
  const stepper = useStepper({
    'create-campaign': {
      title: 'Create Campaign',
      description: 'Office ipsum you must be muted.',
      component: CampaignCreate,
      isValid: () => {
        const state = formState.value
        return Boolean(state.name)
      },
    },
    'select-list': {
      title: 'Select List',
      description: 'Office ipsum you must be muted.',
      component: CampaignSelectList,
      isValid: () => {
        return stepper.isCurrent('show-preview')
      },
    },
    'show-preview': {
      title: 'Preview & confirm',
      description: 'Preview what your meeting window will look like',
      component: CampaignPreview,
      isValid: () => false,
    },
  })

  return { formState, resetFormState, stepper }
}
