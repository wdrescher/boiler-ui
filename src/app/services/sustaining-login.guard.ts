import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

import { AUTH_TOKEN_KEY, AWAITING_VERIFICATION_KEY } from '../app.constants';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class SustainingLoginGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private userStateService: UserStateService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.cookieService.check(AUTH_TOKEN_KEY)) {
      this.userStateService.login(this.cookieService.get(AUTH_TOKEN_KEY));
    }
    else if (this.cookieService.check(AWAITING_VERIFICATION_KEY)) {
      this.userStateService.tempLogin(this.cookieService.get(AWAITING_VERIFICATION_KEY));
    }
    return true;
  }

}
