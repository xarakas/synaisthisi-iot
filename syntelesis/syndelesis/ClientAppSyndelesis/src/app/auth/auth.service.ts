
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { AuthResponse } from '../shared/authData.model';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthService {

  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  signUpUser(authData: {username: string, password: string, email: string}): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.url}register`,
        { 'email': authData.email,
          'username': authData.username,
          'password': authData.password },
        { observe: 'body', responseType: 'json' }
      )
      .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
    }

    signInUser(authData: {username: string, password: string}): Observable<AuthResponse> {
      return this.httpClient
        .post<AuthResponse>(`${this.url}login`,
          { 'username': authData.username, 'password': authData.password },
          { observe: 'body', responseType: 'json' }
        )
        .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
      }

    logOut(refresh_token: string) {
      return this.httpClient
        .post(`${this.url}logout`,
          {'refresh_token': refresh_token },
          { observe: 'body', responseType: 'json' }
        )
        .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
    }

    refreshToken() {
      return this.httpClient
        .post(`${this.url}refresh`,
          {},
          { observe: 'body', responseType: 'json' }
        )
        .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
    }

}
