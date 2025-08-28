import { CampaignCreate, CampaignPreview, CampaignSelectList } from '#components'
import { useStepper } from '@vueuse/core'

export function useCreateCampaign() {
  const { data: countryCodeList } = useLazyAsyncData('get-country-code-list', () =>
    useApi().post('/country-list'), {
    transform: res => res.data,
  })
  // Form state
  function initialState() {
    return ref({
      title: '',
      status: 1,
      country_code: 0,
      description: '',
      caller_id: '',
      custom_caller_id: '',
      dial_mode: '',
      group_id: 0,
      time_based_calling: false,
      call_time: {}, // since it's optional object
      email: 0,
      sms: false,
      send_report: false,
      call_transfer: false,
      disposition_id: [],
      hopper_mode: 0,
      voip_configurations: 0,
      call_ratio: '',
      duration: '',
      automated_duration: false,
      no_agent_available_action: 0,
      amd: false,
      amd_drop_action: null,
      audio_message_amd: null,
      voice_message_amd: null,
      voicedrop_no_agent_available_action: 0,
      inbound_ivr_no_agent_available_action: 0,
      redirect_to: null,
      outbound_ai_dropdown_audio_message: null,
      outbound_ai_dropdown_voice_message: null,
      outbound_ai_dropdown_extension: null,
      outbound_ai_dropdown_ring_group: null,
      outbound_ai_dropdown_ivr: 0,
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
        // const state = formState.value
        // return Boolean(state.name)
        return stepper.isCurrent('select-list') || stepper.isCurrent('show-preview')
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

  return { formState, resetFormState, stepper, countryCodeList }
}
