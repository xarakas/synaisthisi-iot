import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  withLatestFrom,
  catchError,
  tap
} from 'rxjs/operators';

import * as fromApp from '../../store/app.reducers';
import * as fromIoTServiceActions from './iot-service.actions';
import { IoTService } from '../iot-service.model';
import { IoTServicesService } from '../iot-services.service';
import { AlertService } from '../../core/alert.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class IoTServiceEffects {
  private url = environment.apiUrl;

  constructor(
    private actions$: Actions,
    private service: IoTServicesService,
    private store: Store<fromApp.AppState>,
    private alertService: AlertService,
    private router: Router
  ) {}

  @Effect()
  servicesFetch = this.actions$
    .pipe(
      ofType<fromIoTServiceActions.FetchIoTServices>(fromIoTServiceActions.FETCH_IoTSERVICES),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, state]) => {
        // const user_id = state.userData.id;
        const params = action.payload ? '?term=' + action.payload : '';
        return this.service.getIoTServices(params).pipe(
          mergeMap((services: IoTService[]) => {
            return [
              {
                type: fromIoTServiceActions.SET_IoTSERVICES,
                payload: services
              },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: {
                  message: 'Successfully retrieved all services',
                  redirectUrl: '/services'
                }
              }
            ];
          }),
          catchError(error => {
            return of({
              type: fromIoTServiceActions.NET_FAILED,
              payload: error
            });
          })
        );
      })
    );

  @Effect()
  startSelectService = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.START_SELECT_SERVICE),
      map((action: fromIoTServiceActions.StartSelectIoTService) => {
        return action.payload;
      }), // USE in case of user selective fetch (based on PUB/SUB permissions)
      withLatestFrom(this.store.select('auth')),
      switchMap(([service_id, state]) => {
        const user_id = state.userData.id;
        return this.service.getUserService(user_id, service_id).pipe(
          mergeMap((service: IoTService) => {
            return [
              {
                type: fromIoTServiceActions.SET_DETAILED_SERVICE,
                payload: service
              },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: {
                  message: 'Successfully retrieved selected service',
                  redirectUrl: '/services'
                }
              }
            ];
          }),
          catchError(error => {
            return of({
              type: fromIoTServiceActions.NET_FAILED,
              payload: error
            });
          })
        );
      })
    );

  @Effect()
  requestIoTService = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.REQUEST_SERVICE),
      map((action: fromIoTServiceActions.RequestIoTService) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([service_id, state]) => {
        const user_id = state.userData.id;
        return this.service.requestUserService(user_id, service_id).pipe(
          mergeMap(response => {
            return [
              {
                type: fromIoTServiceActions.STOP_REQUEST_SERVICE,
                payload: response
              },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: { message: 'Successfully subscribed to Service!' }
              }
            ];
          }),
          catchError(error => {
            return of({
              type: fromIoTServiceActions.NET_FAILED,
              payload: error
            });
          })
        );
      })
    );

  @Effect()
  createIoTService = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.CREATE_IoTSERVICE),
      map((action: fromIoTServiceActions.CreateIoTService) => {
        return action.payload;
      }),
      switchMap((newService: IoTService) => {
        return this.service.createIoTService(newService).pipe(
          mergeMap(response => {
            return [
              {
                type: fromIoTServiceActions.STOP_CREATE_IoTSERVICE,
                payload: response
              },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: { message: 'Successfully created Service!' }
              },
              {
                type: fromIoTServiceActions.REDIRECT,
                payload: `services/${response.id}`
              }
            ];
          }),
          catchError(error => {
            return of({
              type: fromIoTServiceActions.NET_FAILED,
              payload: error
            });
          })
        );
      })
    );

  @Effect({ dispatch: false })
  failed = this.actions$.pipe(
    ofType(fromIoTServiceActions.NET_FAILED),
    tap((action: fromIoTServiceActions.NetFailed) => {
      this.alertService.error(action.payload['message']);
    })
  );

  @Effect({ dispatch: false })
  success = this.actions$.pipe(
    ofType(fromIoTServiceActions.NET_SUCCESS),
    tap((action: fromIoTServiceActions.NetSuccess) => {
      // this.router.navigate([action.payload.redirectUrl]);
      this.alertService.success(action.payload.message);
    })
  );

  @Effect({ dispatch: false })
  redirect = this.actions$.pipe(
    ofType(fromIoTServiceActions.REDIRECT),
    tap((action: fromIoTServiceActions.Redirect) => {
      this.router.navigate([action.payload]);
    })
  );
}
