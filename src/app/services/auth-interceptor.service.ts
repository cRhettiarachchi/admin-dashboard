import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = localStorage.getItem('id_token');
    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      });

      if (!req.headers.has('Content-Type')) {
        req = req.clone({
          headers: req.headers.set('Content-Type', 'application/json'),
        });
      }

      req = req.clone({
        headers: req.headers.set('Accept', 'application/json'),
      });

      return next.handle(cloned).pipe(
        catchError((error) => {
          if (
            error instanceof HttpErrorResponse &&
            !cloned.url.includes('auth/signin') &&
            error.status === 401
          ) {
            return this.handle401Error(cloned, next);
          }

          return throwError(error);
        })
      );

      // return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }

  addToken(req: any, idToken: string) {
    return req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + idToken),
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.authService.getRefreshToken();

      if (token)
        return this.authService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.authService.updateSession(token);
            this.refreshTokenSubject.next(token);

            return next.handle(this.addToken(request, token.access.token));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authService.logout();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token)))
    );
  }
}
