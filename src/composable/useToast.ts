import { ref } from 'vue'
import type { Toast } from '@/types/toast'

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const showToast = (
    message: string, 
    type: Toast['type'] = 'success', 
    duration: number = 5000
  ) => {
    toasts.value.push({ message, type, duration })

    setTimeout(() => {
      toasts.value.shift()
    }, duration)
  }

  return { toasts, showToast }
} 