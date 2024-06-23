import { Id, Slide, ToastContent, ToastOptions, toast } from 'react-toastify';

export const defaultToastOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored',
  transition: Slide,
};

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

const toastIds: { [key in ToastType]?: Id } = {};

export const showToast = (type: ToastType, content: ToastContent, options: Partial<ToastOptions> = {}): Id => {
  const optionsToApply = { ...defaultToastOptions, ...options };

  if (toastIds[type] === undefined || !toast.isActive(toastIds[type] as Id)) {
    switch (type) {
      case 'success':
        toastIds[type] = toast.success(content, optionsToApply);
        break;
      case 'error':
        toastIds[type] = toast.error(content, optionsToApply);
        break;
      case 'info':
        toastIds[type] = toast.info(content, optionsToApply);
        break;
      case 'warning':
        toastIds[type] = toast.warn(content, optionsToApply);
        break;
      default:
        toastIds[type] = toast(content, optionsToApply);
        break;
    }
  }

  return toastIds[type]!;
};
