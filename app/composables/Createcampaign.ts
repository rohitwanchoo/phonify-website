import type { Campaign } from '~/types/campaign'
import { CampaignCreate, CampaignPreview, CampaignSelectList } from '#components'
import { useStepper } from '@vueuse/core'

export function useCreateCampaign() {
  const { data: countryCodeList } = useLazyAsyncData('get-country-code-list', () =>
    useApi().post('/country-list'), {
    transform: res => res.data,
  })

  const callerIds = [
    {
      id: 0,
      value: 'area_code',
      name: 'Area code',
    },
    {
      id: 1,
      value: 'custom',
      name: 'Custom (Enabled for Custom CLI)',
    },
    {
      id: 2,
      value: 'area_code_random',
      name: 'Area Code and Randomizer',
    },
  ]

  const NoAgentAvailableList = [
    {
      id: 1,
      name: 'Hang Up',
    },
    {
      id: 2,
      name: 'Voice Drop',
    },
    {
      id: 3,
      name: 'Inbound IVR',
    },
  ]

  const timeIntervals = [
    {
      value: 1,
      title: '1 Min',
    },
    {
      value: 2,
      title: '2 Min',
    },
    {
      value: 5,
      title: '5 Min',
    },
    {
      value: 10,
      title: '10 Min',
    },
    {
      value: 20,
      title: '20 Min',
    },
    {
      value: 30,
      title: '30 Min',
    },
  ]

  const redirectToList = [
    {
      value: 1,
      title: 'Audio Message',
    },
    {
      value: 2,
      title: 'Voice Template',
    },
    {
      value: 3,
      title: 'Extension',
    },
    {
      value: 4,
      title: 'RingGroup',
    },
    {
      value: 5,
      title: 'ivr',
    },
  ]

  // amd drop action list
  const amdDropActions = [
    {
      id: 1,
      name: 'Hang Up',
    },
    {
      id: 2,
      name: 'Audio Message',
    },
    {
      id: 3,
      name: 'Voice template',
    },
  ]

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
      component: CampaignCreate,
      isValid: () => false,
    },
  })

  const enableEditSection = useState<'campaign-details' | 'caller-details' | 'time-based-calling' | 'other-details' | 'send-details' | 'associated-list' | ''>('enable-edit-section', () => '')
  /**
   * Transform campaign data to form values
   * @param campaignData - The campaign data from API
   * @param campaignDeposition - The campaign disposition data
   * @returns Transformed form values
   */
  function transformCampaignToFormValues(
    campaignData: Campaign,
    campaignDeposition: Array<{ disposition_id: any }>,
  ) {
    return {
      ...campaignData,
      status: campaignData.status,
      title: campaignData.title,
      country_code: campaignData.country_code,
      description: campaignData.description,
      caller_id: campaignData?.caller_id,
      dial_mode: campaignData.dial_mode,
      group_id: campaignData.group_id,
      call_ratio: campaignData.call_ratio,
      duration: campaignData.duration,
      no_agent_available_action: campaignData?.no_agent_available_action,
      automated_duration: campaignData.automated_duration === '1',
      amd: campaignData.amd === '1',
      amd_drop_action: campaignData.amd_drop_action,
      time_based_calling: campaignData.time_based_calling === 1,
      email: Number(campaignData.email),
      sms: campaignData.sms === '1',
      send_report: campaignData.send_report === 1,
      call_transfer: campaignData.call_transfer === '1',
      hopper_mode: campaignData.hopper_mode,
      custom_caller_id: String(campaignData.custom_caller_id),
      call_schedule_id: campaignData.call_schedule_id,
      disposition_id: campaignData?.dispositions?.map(Number),

    }
  }

  return { formState, resetFormState, stepper, countryCodeList, callerIds, NoAgentAvailableList, timeIntervals, redirectToList, amdDropActions, transformCampaignToFormValues, enableEditSection }
}
