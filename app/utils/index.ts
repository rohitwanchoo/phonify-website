import { getCountries, parsePhoneNumberFromString } from 'libphonenumber-js'
import { toast } from 'vue-sonner'

interface ToastOptions {
  type?: 'success' | 'error' | 'warning'
  message: string
  description?: string
  action?: any
}

export function showToast(options: ToastOptions) {
  const { type = 'success', message, description, action } = options

  toast[type](message, {
    description,
    action: action || {
      label: 'close',
    },
    style: {
      background: {
        success: '#48BB78',
        warning: '#ECC94B',
        error: '#F56565',
      }[type],
      color: '#fff',
    },
  })
}

interface ErrorResponse {
  errors: {
    [field: string]: string[] | string // Messages can be either an array or a single string
  }
}

type SetFieldErrorFunction = (field: string, message: string) => void

export function handleFieldErrors(
  errorResponse: ErrorResponse,
  setFieldError: SetFieldErrorFunction,
): void {
  const { errors } = errorResponse

  Object.entries(errors).forEach(([field, messages]) => {
    const message = Array.isArray(messages) ? messages.join(' ') : messages
    if (message) {
      setFieldError(field, message)
    }
  })
}

/**
 * Formats a phone number into US format
 * @param number - The phone number string to format
 * @returns The formatted US phone number, or the original number if parsing fails
 *
 * This function takes a phone number string and attempts to parse it as a US phone number
 * using the libphonenumber-js library. If successful, it returns the number in national
 * format (e.g. (555) 123-4567). If parsing fails, it returns the original input number.
 */
export function formatNumber(number: string) {
  const parsedNumber = parsePhoneNumberFromString(number, 'US')
  return parsedNumber?.formatNational() || number
}

// function for listing countries with the code using libphonenumber-js
export function getCountriesAll() {
  const countries = import('~/assets/data/countries.json').then(m => m.default)
  return countries
}

export function copyToClipboard(value: any, name?: string) {
  navigator.clipboard.writeText(value)
    .then(() => {
      showToast({ message: `${name || ''} copied to clipboard` })
    })
    .catch(() => { })
}

export function formatWithCommas(value: number | string): string {
  return new Intl.NumberFormat().format(Number(value))
}

export const timeZones = [
  { value: 'Pacific/Midway', title: '(GMT-11:00) Midway Island, Samoa' },
  { value: 'America/Adak', title: '(GMT-10:00) Hawaii-Aleutian' },
  { value: 'Etc/GMT+10', title: '(GMT-10:00) Hawaii' },
  { value: 'Pacific/Marquesas', title: '(GMT-09:30) Marquesas Islands' },
  { value: 'Pacific/Gambier', title: '(GMT-09:00) Gambier Islands' },
  { value: 'America/Anchorage', title: '(GMT-09:00) Alaska' },
  { value: 'America/Ensenada', title: '(GMT-08:00) Tijuana, Baja California' },
  { value: 'Etc/GMT+8', title: '(GMT-08:00) Pitcairn Islands' },
  { value: 'America/Los_Angeles', title: '(GMT-08:00) Pacific Time (US & Canada)' },
  { value: 'America/Denver', title: '(GMT-07:00) Mountain Time (US & Canada)' },
  { value: 'America/Chihuahua', title: '(GMT-07:00) Chihuahua, La Paz, Mazatlan' },
  { value: 'America/Dawson_Creek', title: '(GMT-07:00) Arizona' },
  { value: 'America/Belize', title: '(GMT-06:00) Saskatchewan, Central America' },
  { value: 'America/Cancun', title: '(GMT-06:00) Guadalajara, Mexico City, Monterrey' },
  { value: 'Chile/EasterIsland', title: '(GMT-06:00) Easter Island' },
  { value: 'America/Chicago', title: '(GMT-06:00) Central Time (US & Canada)' },
  { value: 'America/New_York', title: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Havana', title: '(GMT-05:00) Cuba' },
  { value: 'America/Bogota', title: '(GMT-05:00) Bogota, Lima, Quito, Rio Branco' },
  { value: 'America/Caracas', title: '(GMT-04:30) Caracas' },
  { value: 'America/Santiago', title: '(GMT-04:00) Santiago' },
  { value: 'America/La_Paz', title: '(GMT-04:00) La Paz' },
  { value: 'Atlantic/Stanley', title: '(GMT-04:00) Faukland Islands' },
  { value: 'America/Campo_Grande', title: '(GMT-04:00) Brazil' },
  { value: 'America/Goose_Bay', title: '(GMT-04:00) Atlantic Time (Goose Bay)' },
  { value: 'America/Glace_Bay', title: '(GMT-04:00) Atlantic Time (Canada)' },
  { value: 'America/St_Johns', title: '(GMT-03:30) Newfoundland' },
  { value: 'America/Araguaina', title: '(GMT-03:00) UTC-3' },
  { value: 'America/Montevideo', title: '(GMT-03:00) Montevideo' },
  { value: 'America/Miquelon', title: '(GMT-03:00) Miquelon, St. Pierre' },
  { value: 'America/Godthab', title: '(GMT-03:00) Greenland' },
  { value: 'America/Argentina/Buenos_Aires', title: '(GMT-03:00) Buenos Aires' },
  { value: 'America/Sao_Paulo', title: '(GMT-03:00) Brasilia' },
  { value: 'America/Noronha', title: '(GMT-02:00) Mid-Atlantic' },
  { value: 'Atlantic/Cape_Verde', title: '(GMT-01:00) Cape Verde Is.' },
  { value: 'Atlantic/Azores', title: '(GMT-01:00) Azores' },
  { value: 'Europe/Belfast', title: '(GMT) Greenwich Mean Time : Belfast' },
  { value: 'Europe/Dublin', title: '(GMT) Greenwich Mean Time : Dublin' },
  { value: 'Europe/Lisbon', title: '(GMT) Greenwich Mean Time : Lisbon' },
  { value: 'Europe/London', title: '(GMT) Greenwich Mean Time : London' },
  { value: 'Africa/Abidjan', title: '(GMT) Monrovia, Reykjavik' },
  { value: 'Europe/Amsterdam', title: '(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
  { value: 'Europe/Belgrade', title: '(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague' },
  { value: 'Europe/Brussels', title: '(GMT+01:00) Brussels, Copenhagen, Madrid, Paris' },
  { value: 'Africa/Algiers', title: '(GMT+01:00) West Central Africa' },
  { value: 'Africa/Windhoek', title: '(GMT+01:00) Windhoek' },
  { value: 'Asia/Beirut', title: '(GMT+02:00) Beirut' },
  { value: 'Africa/Cairo', title: '(GMT+02:00) Cairo' },
  { value: 'Asia/Gaza', title: '(GMT+02:00) Gaza' },
  { value: 'Africa/Blantyre', title: '(GMT+02:00) Harare, Pretoria' },
  { value: 'Asia/Jerusalem', title: '(GMT+02:00) Jerusalem' },
  { value: 'Europe/Minsk', title: '(GMT+02:00) Minsk' },
  { value: 'Asia/Damascus', title: '(GMT+02:00) Syria' },
  { value: 'Europe/Moscow', title: '(GMT+03:00) Moscow, St. Petersburg, Volgograd' },
  { value: 'Africa/Addis_Ababa', title: '(GMT+03:00) Nairobi' },
  { value: 'Asia/Tehran', title: '(GMT+03:30) Tehran' },
  { value: 'Asia/Dubai', title: '(GMT+04:00) Abu Dhabi, Muscat' },
  { value: 'Asia/Yerevan', title: '(GMT+04:00) Yerevan' },
  { value: 'Asia/Kabul', title: '(GMT+04:30) Kabul' },
  { value: 'Asia/Yekaterinburg', title: '(GMT+05:00) Ekaterinburg' },
  { value: 'Asia/Tashkent', title: '(GMT+05:00) Tashkent' },
  { value: 'Asia/Kolkata', title: '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi' },
  { value: 'Asia/Katmandu', title: '(GMT+05:45) Kathmandu' },
  { value: 'Asia/Dhaka', title: '(GMT+06:00) Astana, Dhaka' },
  { value: 'Asia/Novosibirsk', title: '(GMT+06:00) Novosibirsk' },
  { value: 'Asia/Rangoon', title: '(GMT+06:30) Yangon (Rangoon)' },
  { value: 'Asia/Bangkok', title: '(GMT+07:00) Bangkok, Hanoi, Jakarta' },
  { value: 'Asia/Krasnoyarsk', title: '(GMT+07:00) Krasnoyarsk' },
  { value: 'Asia/Hong_Kong', title: '(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi' },
  { value: 'Asia/Irkutsk', title: '(GMT+08:00) Irkutsk, Ulaan Bataar' },
  { value: 'Australia/Perth', title: '(GMT+08:00) Perth' },
  { value: 'Australia/Eucla', title: '(GMT+08:45) Eucla' },
  { value: 'Asia/Tokyo', title: '(GMT+09:00) Osaka, Sapporo, Tokyo' },
  { value: 'Asia/Seoul', title: '(GMT+09:00) Seoul' },
  { value: 'Asia/Yakutsk', title: '(GMT+09:00) Yakutsk' },
  { value: 'Australia/Adelaide', title: '(GMT+09:30) Adelaide' },
  { value: 'Australia/Darwin', title: '(GMT+09:30) Darwin' },
  { value: 'Australia/Brisbane', title: '(GMT+10:00) Brisbane' },
  { value: 'Australia/Hobart', title: '(GMT+10:00) Hobart' },
  { value: 'Asia/Vladivostok', title: '(GMT+10:00) Vladivostok' },
  { value: 'Australia/Lord_Howe', title: '(GMT+10:30) Lord Howe Island' },
  { value: 'Etc/GMT-11', title: '(GMT+11:00) Solomon Is., New Caledonia' },
  { value: 'Asia/Magadan', title: '(GMT+11:00) Magadan' },
  { value: 'Pacific/Norfolk', title: '(GMT+11:30) Norfolk Island' },
  { value: 'Asia/Anadyr', title: '(GMT+12:00) Anadyr, Kamchatka' },
  { value: 'Pacific/Auckland', title: '(GMT+12:00) Auckland, Wellington' },
  { value: 'Etc/GMT-12', title: '(GMT+12:00) Fiji, Kamchatka, Marshall Is.' },
  { value: 'Pacific/Chatham', title: '(GMT+12:45) Chatham Islands' },
  { value: 'Pacific/Tongatapu', title: '(GMT+13:00) Nuku\'alofa' },
  { value: 'Pacific/Kiritimati', title: '(GMT+14:00) Kiritimati' },
]

export function userAvatarWord(fullName: string) {
  if (!fullName)
    return ''
  const splittedNames = fullName?.trim()?.split(' ')
  let name = ''
  if (splittedNames.length >= 2) {
    splittedNames.map((item: string, index: number) => {
      if (index < 2 && item[0])
        name += item[0]
    })
  }
  else {
    name = fullName[0]
    if (fullName[1])
      name += fullName[1]
  }
  return name?.toUpperCase()
}
