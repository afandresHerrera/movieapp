import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log("entre al interceptor");
    request = request.clone({
      setHeaders: {
        'authorization': 'Bearer ' + environment.apiKey
      }
    });
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        let errorMsg = '';
        if (response.error instanceof ErrorEvent) {
          // console.log('This is client side error');
          errorMsg = `Error: ${response.error.message}`;
        }

        if (response.status === 401) {
          console.log('el usuario ha sido desautenticado');
        }
        console.log(errorMsg);

        return throwError(() => response);
      }),
      finalize(() => { })
    )
  }
}
