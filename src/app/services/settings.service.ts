import { HttpClient, HttpErrorResponse, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.constants';
import { User } from '../app.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private _http: HttpClient
  ) { }

  updateUser(username: string, data: any): Observable<User | HttpErrorResponse> {
    return this._http.post(`${API_URL}/api/user/edit`, data).pipe(map(
      (res: User) => res, 
      (err: HttpErrorResponse) => err
    )); 
  }

  changePassword(new_password: string): Observable<HttpResponseBase | HttpErrorResponse> {
    const data = {
      password: new_password
    }
    return this._http.post(`${API_URL}/api/auth/change-password`, data).pipe(map(
      (res: HttpResponseBase) => res as HttpResponseBase, 
      (err: HttpErrorResponse) => err as HttpErrorResponse
    ))
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
