import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import {Observable, throwError, BehaviorSubject} from 'rxjs';
import {catchError, filter, take, switchMap} from 'rxjs/operators';
import {AuthService} from "../services/auth_service/auth.service";
import {TokenStorageService} from "../services/token_storage_service/token-storage.service";
import {Router} from "@angular/router";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing: Boolean = false;

  constructor(public authService: AuthService, private tokenStorage: TokenStorageService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.tokenStorage.getToken();
    if (token) {
      request = this.addToken(request, token!.toString());
    }

    return next.handle(request).pipe(catchError(error => {
      if (error.status === 401 && error instanceof HttpErrorResponse) {
        return this.handle401Error(request, next);
      } else {
        return throwError(error);
      }
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((token) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token['access']);
          return next.handle(this.addToken(request, token['access']));
        }));
    } else {
      console.log("auth.interceptor->handle401Error->else"); //todo auth.interceptor->handle401Error->else ???
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          console.log("swithmap jwt = " + jwt);
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)});
  }
}

export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
