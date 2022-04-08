import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.constants';

import { User } from '../app.interface';

@Injectable({
  providedIn: 'root'
})
export class ProfileStateService {
  private _users: {[username: string]: User} = {}; 
  private _user: User = undefined; 

  constructor(
    private _http: HttpClient
  ) { }

  private fetchUser(username): Observable<User | HttpErrorResponse> {
    return this._http.get(`${API_URL}/v1/user/${username}`).pipe(map(
      (res: User) => res as User, 
      (err: HttpErrorResponse) => err as HttpErrorResponse
    ))
  }

  setUser(username: string): Observable<boolean> {
    if (!!this._users[username]) {
      this._user = this._users[username];
      return of(true); 
    }
    else {
      return this.fetchUser(username).pipe(map(
        (user: User) => {
          this._users[username] = user; 
          this._user = user;
          return true
        }, 
        () => {
          return false
        }
      ))
    }
  }

  get user(): User {
    return this._user; 
  }
}
