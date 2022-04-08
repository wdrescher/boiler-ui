import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.constants';
import { User } from '../app.interface';

import { UpdateUserRequest } from './settings.interface'; 

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private _http: HttpClient
  ) { }

  updateUser(username: string, data: UpdateUserRequest): Observable<User | HttpErrorResponse> {
    return this._http.post(`${API_URL}/v1/user/${username}`, data).pipe(map(
      (res: User) => res, 
      (err: HttpErrorResponse) => err
    )); 
  }

  doesUserExists(username: string): Observable<boolean> {
    return this._http.get(`${API_URL}/v1/user/${username}/exists`).pipe(
      map(
        () => true, 
        () => false, 
      )
    )
  }
}
