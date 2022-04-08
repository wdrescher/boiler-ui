import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ErrorResponse, LoginSuccessResponse, RegisterUserRequest, ValidateTokenSuccessResponse } from './reqeusts.interface';
import { API_URL } from 'src/app/app.constants';
import { map } from 'rxjs/operators';
import { User } from '../app.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) { }

  validateToken(token: string): Observable<ValidateTokenSuccessResponse | HttpErrorResponse> {
    return this.http.get(`${API_URL}/v1/email/verification/validate?token=${token}`).pipe(
      map(
        (res: ValidateTokenSuccessResponse) => {
          return res; 
        }, 
        (err: ErrorResponse) => {
          return err; 
        }
      )
    );
  }

  attemptLogin(username: string, password: string): Observable<LoginSuccessResponse | HttpErrorResponse> {
    let data = `username=${username}&password=${password}`
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    return this.http.post(`${API_URL}/api/auth/login`, data, {headers: headers})
      .pipe(
        map(
          (res: LoginSuccessResponse) => {
            return res;
          },
          (res: ErrorResponse) => {
            return res; 
          }
        )
      )
  }

  generateToken(username: string): Observable<HttpResponse<null> | HttpErrorResponse> {
    let payload = {
      email: username
    }
    return this.http.post(`${API_URL}/v1/email/verification/generate`, payload).pipe(
      map(
        (response: HttpResponse<null>) => {
          return response
        },
        (response: HttpErrorResponse) => {
          return response; 
        }
      )
    ); 
  }

  registerUser(username: string, password: string, first_name: string, last_name: string): Observable<User | HttpErrorResponse> {
    let registerUserRequest: RegisterUserRequest = {
      email: username, 
      password: password, 
      first_name: first_name, 
      last_name: last_name
    }
    return this.http.post(`${API_URL}/api/auth/signup`, registerUserRequest).pipe(
      map(
        (res: User) => {
          return res;
        }, 
        (err: ErrorResponse) => {
          return err; 
        }
      )
    ); 
  }

  forgotPassword(email: string): Observable<HttpResponse<null>|HttpErrorResponse> {
    let data = {
      email: email
    }
    return this.http.post(`${API_URL}/v1/email/reset_password`, data)
      .pipe(
        map(
          (res: HttpResponse<null>) => {
            return res;
          },
          (err: HttpErrorResponse) => {
            return err; 
          }
        )
      )
  }

  loadUser(): Observable<User | HttpErrorResponse> {
    return this.http.get(`${API_URL}/api/user/`).pipe(
      map(
        (res: User ) => {
          return res as User; 
        }, 
        (err: HttpErrorResponse) => {
          return err as HttpErrorResponse; 
        }
      )
    )
  } 
}
