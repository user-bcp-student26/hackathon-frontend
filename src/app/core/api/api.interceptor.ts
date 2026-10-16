import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthSessionService } from '../auth/auth-session.service';

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = environment.apiBaseUrl;

  if (!baseUrl) {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 0,
          statusText: 'API_BASE_URL_NOT_CONFIGURED',
          error: {
            code: 'API_BASE_URL_NOT_CONFIGURED',
            message: 'La API no está configurada para este entorno.',
          },
        }),
    );
  }

  const authSession = inject(AuthSessionService);
  const isPublicRegistration =
    request.method === 'POST' && request.url === '/users';
  const isLogin = request.method === 'POST' && request.url === '/auth/login';
  const authorization = authSession.authorizationHeader();
  const headers =
    !isPublicRegistration && !isLogin && authorization
      ? request.headers.set('Authorization', authorization)
      : request.headers;
  const apiRequest = request.clone({
    url: new URL(request.url, baseUrl).toString(),
    headers,
  });

  return next(apiRequest).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isLogin
      ) {
        authSession.logout();
      }

      return throwError(() => error);
    }),
  );
};