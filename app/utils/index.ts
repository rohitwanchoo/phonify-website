import { parsePhoneNumberFromString } from 'libphonenumber-js'
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
