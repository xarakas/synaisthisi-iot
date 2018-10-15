
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
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)))
  }

  requestUserService(user_id: number, service_id: number): Observable<IoTService> {
    return this.httpClient.put<IoTService>(
      `${this.url}users/${user_id}/services/${service_id}`, {}, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)))
  }

  createIoTService(service: IoTService): Observable<IoTService> {
    return this.httpClient.post<IoTService>(
      `${this.url}services`, service, { observe: 'body', responseType: 'json' }
  )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)))
  }

}
