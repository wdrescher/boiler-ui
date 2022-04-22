import { Inject, Injectable } from '@angular/core';
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
    @Inject(UserStateService) private _userStateService: UserStateService,
    @Inject(AppStateService) private _appStateService: AppStateService,
    @Inject(AuthService) private _authService: AuthService,
    @Inject(Router) private _router: Router,
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
