import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { BRAND_MARINE } from './constants/brand.constants';
import { ApiError } from '../core/models/api-response.model';

const TOAST_OPTIONS = {
  toast: true,
  position: 'bottom-end' as const,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
};

function showNotify(
  title: string,
  icon: SweetAlertIcon,
): Promise<SweetAlertResult> {
  return Swal.fire({ ...TOAST_OPTIONS, title, icon });
}

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  if ('error' in error) {
    const apiError = (error as { error?: unknown }).error as
      | Partial<ApiError>
      | undefined;
    if (apiError && typeof apiError.message === 'string')
      return apiError.message;
  }
  if ('message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return undefined;
}

export function showNotifySuccess(title: string): Promise<SweetAlertResult> {
  return showNotify(title, 'success');
}
export function showNotifyWarning(title: string): Promise<SweetAlertResult> {
  return showNotify(title, 'warning');
}
export function showNotifyError(
  title: string,
  error?: unknown,
): Promise<SweetAlertResult> {
  return Swal.fire({
    ...TOAST_OPTIONS,
    title,
    text: getErrorMessage(error),
    icon: 'error',
  });
}
export function showSwalSuccess(
  title: string,
  message: string,
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    confirmButtonColor: BRAND_MARINE,
  });
}
export function showSwalError(
  title: string,
  message: string,
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonColor: BRAND_MARINE,
  });
}
export function showSwalWarning(
  title: string,
  message: string,
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    confirmButtonColor: BRAND_MARINE,
  });
}
export function showModalConfirmation(
  title: string,
  message: string,
): Promise<SweetAlertResult> {
  return Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: BRAND_MARINE,
    cancelButtonColor: '#d1d1d1',
  });
}
export function showLoading(show = true): void {
  if (!show) {
    Swal.close();
    return;
  }
  void Swal.fire({
    title: 'Cargando...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    backdrop: true,
    didOpen: () => Swal.showLoading(),
  });
}
