
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IoTService } from './iot-service.model';


@Injectable()
export class IoTServicesService {

  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getIoTServices(params: string): Observable<IoTService[]> {
    return this.httpClient.get<IoTService[]>(
        `${this.url}services${params}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  getUserService(user_id: number, service_id: number): Observable<IoTService> {
    return this.httpClient.get<IoTService>(
      `${this.url}users/${user_id}/services/${service_id}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  requestUserService(user_id: number, service_id: number): Observable<IoTService> {
    return this.httpClient.put<IoTService>(
      `${this.url}users/${user_id}/services/${service_id}`, {}, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  createIoTService(service: IoTService): Observable<IoTService> {
    return this.httpClient.post<IoTService>(
      `${this.url}services`, service, { observe: 'body', responseType: 'json' }
  )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  deleteIoTService(service_id: number): Observable<any> {
    return this.httpClient.delete(
        `${this.url}services/${service_id}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

// ############NEW################
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

  importUserServices( user_id: number, uploadData: FormData) {
    return this.httpClient
    .post(
      `${this.url}users/${user_id}/exportServices`,
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

  getServicesOntology(): Observable<string[]> {
    return this.httpClient.get<string[]>(
        `${this.url}services/ontology`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

}
