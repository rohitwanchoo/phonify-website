import { h } from 'vue'
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
