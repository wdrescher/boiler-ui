import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { API_URL } from '../app.constants';

import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private userStateService: UserStateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if ('blob' === req.responseType || req.headers.has('Ignore-Bearer')) {
      return next.handle(req)
    }
    if (this.userStateService.isLoggedIn === true) {
      req = req.clone({
        setHeaders: {
          'Authorization':`Bearer ${this.userStateService.token}`
        }
      });
    }

    return next.handle(req);
  }
}