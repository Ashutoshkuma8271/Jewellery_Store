import toast, { ToastOptions } from 'react-hot-toast';

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, options);
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, options);
};

export const showLoadingToast = (message: string, options?: ToastOptions) => {
  return toast.loading(message, options);
};

export const dismissToast = (toastId?: string) => {
  toast.dismiss(toastId);
};

export { toast };
