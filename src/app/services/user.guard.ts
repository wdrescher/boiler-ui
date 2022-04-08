import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/internal/operators/take';
import { map } from 'rxjs/operators';
import { AppState, User } from '../app.interface';
import { AppStateService } from './app-state.service';
import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(
    private _userStateService: UserStateService,
    private _appStateService: AppStateService,
    private _authService: AuthService,
    private _router: Router,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this._userStateService.isLoggedIn || this._userStateService.isDefined) {
      return true;
    }
    else {
      return this._authService.loadUser()
        .pipe(take(1),
          map(
            (response: User) => {
              this._userStateService.loadUser(response);
              return true;
            },
            () => {
              this._appStateService.toggleErrorModal();
              this._userStateService.signout();
              this._router.navigateByUrl(AppState.LOGIN);
            }
          ))
    }
  }

}
