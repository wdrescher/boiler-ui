import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

import { AUTH_TOKEN_KEY, AWAITING_VERIFICATION_KEY } from '../app.constants';
import { User } from '../app.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private _user: User;
  private _isLoggedIn = false;
  private _awaitingVerification: boolean;

  $postInProgress = new Subject<boolean>();
  $newContentStream = new Subject<File>();
  token: string;

  constructor(
    private cookieService: CookieService
  ) { }

  signout(): void {
    this._isLoggedIn = false;
    this._user = undefined;
    this._awaitingVerification = false;
    this.cookieService.deleteAll("/");
  }

  login(token: string, expirationDate?: Date): void {
    this.cookieService.deleteAll();
    this.cookieService.set(AUTH_TOKEN_KEY, token, expirationDate, "/");
    this.token = token;
    this._awaitingVerification = false;
    this._isLoggedIn = true;
  }

  tempLogin(email: string): void {
    let now = new Date(); 
    now.setHours(now.getHours() + 2);
    this.cookieService.deleteAll("/"); 
    this.cookieService.set(AWAITING_VERIFICATION_KEY, email, now, "/");
    this._awaitingVerification = true;
  }

  loadUser(user: User): void {
    this._user = user;
  }

  get username(): string {
    return this.isDefined ? this._user.username : ''; 
  }

  get awaitingVerification(): boolean {
    return this._awaitingVerification;
  }

  get isDefined(): boolean {
    return !!this._user;
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get firstName(): string {
    return this.isDefined ? this._user.first_name : "";  
  }

  get lastName(): string {
    return this.isDefined ? this._user.last_name : "";  
  }

  get email(): string {
    return this.isDefined ? this._user.email : "";
  }
}
