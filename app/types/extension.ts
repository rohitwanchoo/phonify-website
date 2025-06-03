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
  extension_type: string
}
