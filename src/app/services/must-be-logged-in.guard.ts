import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../app.interface';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class MustBeLoggedInGuard implements CanActivate {
  constructor(
    private userStateService: UserStateService, 
    private router: Router
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userStateService.isLoggedIn || this.userStateService.awaitingVerification ? true : this.router.navigateByUrl[AppState.LOGIN]
  }
  
}
