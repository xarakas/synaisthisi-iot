
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

import { UserData } from '../shared/authData.model';
import { IoTService } from '../iot-services/iot-service.model';
import { environment } from '../../environments/environment';

@Injectable()
export class UserSpaceService {
  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getUserData(userId: number): Observable<UserData> {
    return this.httpClient
      .get<UserData>(`${this.url}/accounts/${userId}`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  updateUserData(
    userId: number,
    email: string,
    password: string
  ): Observable<UserData> {
    return this.httpClient
      .put<UserData>(
        `${this.url}/accounts/${userId}`,
        { email: email, password: password },
        { observe: 'body', responseType: 'json' }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }
}
