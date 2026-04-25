import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const message = error.error?.detail ?? error.message ?? 'An unexpected error occurred';
        console.error(`[HTTP Error] ${error.status}: ${message}`);
        return throwError(() => new Error(message));
      })
    );
  }
}
