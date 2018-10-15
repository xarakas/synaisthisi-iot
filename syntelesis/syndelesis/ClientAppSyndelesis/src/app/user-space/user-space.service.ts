
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

  getIoTOwnedServices(user_id: number): Observable<IoTService[]> {
    return this.httpClient
      .get<IoTService[]>(`${this.url}users/${user_id}/services/ownership`, {
        observe: 'body',
        responseType: 'json'
      })
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  uploadServiceFile(user_id: number, service_id: number, uploadData: FormData) {
    return this.httpClient
      .post(
        `${this.url}users/${user_id}/services/${service_id}/uploads`,
        uploadData,
        {
          // reportProgress: true,
          // observe: 'events'
          observe: 'body',
          responseType: 'json'
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  startService(
    user_id: number,
    service_id: number,
    serviceParam: string
  ) {
    return this.httpClient
      .post(
        `${this.url}users/${user_id}/services/${service_id}/status`,
        { serviceArgs: serviceParam },
        {
          observe: 'body',
          responseType: 'json'
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  stopService(
    user_id: number,
    service_id: number,
  ) {
    return this.httpClient
      .delete(
        `${this.url}users/${user_id}/services/${service_id}/status`,
        {
          observe: 'body',
          responseType: 'json'
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  getServiceStatus(
    user_id: number,
    service_id: number,
  ) {
    return this.httpClient
      .get(
        `${this.url}users/${user_id}/services/${service_id}/status`,
        {
          observe: 'body',
          responseType: 'json'
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => observableThrowError(err.error))
      );
  }

  exportUserServices(
    user_id: number
  ) {
    return this.httpClient
    .get(
      `${this.url}users/${user_id}/exportServices`,
      {
        responseType: 'blob' as 'json'
      }
    )
    .pipe(
      catchError((err: HttpErrorResponse) => observableThrowError(err.error))
    );
  }

  getServiceLogFile(
    user_id: number,
    service_id: number
  ) {
    return this.httpClient
    .get(
      `${this.url}users/${user_id}/services/${service_id}/logFile`,
      {
        responseType: 'blob' as 'json'
      }
    )
    .pipe(
      catchError((err: HttpErrorResponse) => observableThrowError(JSON.stringify(err.error)))
    );
  }
}
