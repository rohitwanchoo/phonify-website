export interface Campaign {
  id: number
  name: string
  status: string
  country_code: number
  description: string
  caller_id: number
  custom_caller_id: string
  dial_mode: string
  group_id: number
  time_based_calling: boolean
  call_time: CallTime | null
  email: number
  sms: boolean
  send_report: boolean
  call_transfer: boolean
  disposition_id: any[]
  hopper_mode: number
  voip_configurations: number
  call_ratio: number | null
  duration: number | null
  automated_duration: boolean
  no_agent_available_action: number | null
  amd: boolean
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
  name: string
  start_time: string
  end_time: string
}
