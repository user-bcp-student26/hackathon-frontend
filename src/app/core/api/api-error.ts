import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const apiMessage = (error.error as { message?: unknown } | null)?.message;

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage;
    }

    if (error.status === 0) {
      return 'No fue posible conectar con el servicio. Inténtalo de nuevo.';
    }
  }

  return fallback;
}