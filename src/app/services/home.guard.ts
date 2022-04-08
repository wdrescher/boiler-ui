import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppState } from '../app.interface';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private userStateService: UserStateService, 
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userStateService.isLoggedIn || this.userStateService.awaitingVerification) {
      return this.router.navigateByUrl(AppState.GALLERY); 
    }
    return true; 
  }
  
}
