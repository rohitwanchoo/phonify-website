export interface Extension {
  id: number
  siNo?: number
  extension: number
  secret: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  actions?: string
  serverList: {
    id: number
    ip_address: string
    detail: string | null
    domain: string
    title_name: string
  }[]
  country_code: number
  enable_2fa: string
  call_forward: number
  follow_me: number
  voicemail_send_to_email: number
  voicemail: number
  ip_filtering: string
  twinning: string
  cli_setting: number
  asterisk_server_id: number
  vm_pin: number
  extension_type: string
  app_status: string
  cli: string
  package_id: number
  group: { group_id: number }[]
  timezone: string
  receive_sms_on_email: string
  receive_sms_on_mobile: string
  extension_id: number
}
