import { toast } from 'react-toastify';

/* Success toast */
export const successToast = (mess) => {
    return toast.success(mess);
}

/* Error toast */
export const errToast = (mess) => {
    return toast.error(mess);
}

/* Warning toast */
export const warnToast = (mess) => {
    return toast.warn(mess);
}