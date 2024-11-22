export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastInterface {
  id: string | number;
  message: string;
  type: ToastType;
  duration: number;
}
  