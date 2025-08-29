export interface Campaign {
  id: number
  title: string
  status: number
  country_code: number
  description: string
  caller_id: string
  custom_caller_id: string
  dial_mode: string
  group_id: number
  time_based_calling: boolean | number
  call_time: CallTime | null
  email: number
  sms: boolean | string
  send_report: boolean | number
  call_transfer: boolean | string
  disposition_id: any[]
  hopper_mode: number
  voip_configurations: number
  call_ratio: number | null
  duration: number | null
  automated_duration: boolean | string
  no_agent_available_action: number | null
  amd: boolean | string
  amd_drop_action: number | null
  audio_message_amd: number | null
  voice_message_amd: number | null
  voicedrop_no_agent_available_action: number | null
  inbound_ivr_no_agent_available_action: number | null
  redirect_to: number | null
  outbound_ai_dropdown_audio_message: number | null
  outbound_ai_dropdown_voice_message: number | null
  outbound_ai_dropdown_extension: number | null
  outbound_ai_dropdown_ring_group: number | null
  outbound_ai_dropdown_ivr: number | null
}

interface CallTime {
  id: number
  title: string
  from_time: string
  to_time: string
}
