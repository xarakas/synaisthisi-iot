import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

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
import * as fromAuthActions from '../../auth/store/auth.actions';
import * as fromIoTServiceActions from '../../iot-services/store/iot-service.actions';
import * as fromUserSpaceActions from './user-space.actions';
import { UserSpaceService } from '../user-space.service';
import { AlertService } from '../../core/alert.service';
import { UserData } from '../../shared/authData.model';
import { IoTService } from '../../iot-services/iot-service.model';

@Injectable()
export class UserSpaceEffects {
  constructor(
    private actions$: Actions,
    private service: UserSpaceService,
    private store: Store<fromApp.AppState>,
    private alertService: AlertService
  ) {}

  @Effect()
  getUserData = this.actions$.ofType(fromUserSpaceActions.GET_USER_DATA).pipe(
    withLatestFrom(this.store.select(fromApp.getUserData)),
    switchMap(([action, userData]) => {
      return this.service.getUserData(userData.id).pipe(
        mergeMap((updatedUserData: UserData) => {
          return [
            {
              type: fromAuthActions.SET_USERDATA,
              payload: updatedUserData
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromUserSpaceActions.NET_FAILED, payload: error });
        })
      );
    })
  );

  @Effect()
  updateUserData = this.actions$
    .ofType(fromUserSpaceActions.UPDATE_USER_DATA)
    .pipe(
      map((action: fromUserSpaceActions.UpdateUserData) => action.payload),
      withLatestFrom(this.store.select(fromApp.getUserData)),
      switchMap(([payload, userData]) => {
        return this.service
          .updateUserData(userData.id, payload.email, payload.password)
          .pipe(
            mergeMap((updatedUserData: UserData) => {
              return [
                {
                  type: fromAuthActions.SET_USERDATA,
                  payload: updatedUserData
                },
                {
                  type: fromUserSpaceActions.NET_SUCCESS,
                  payload: 'User Data Updated!'
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromUserSpaceActions.NET_FAILED,
                payload: error
              });
            })
          );
      })
    );

  @Effect()
  servicesFetch = this.actions$
    .ofType(fromUserSpaceActions.GET_USER_OWNED_SERVICES)
    .pipe(
      map((action: fromUserSpaceActions.GetUserOwnedServices) => {
        return action;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([action, state]) => {
        const user_id = state.userData.id;
        return this.service.getIoTOwnedServices(user_id).pipe(
          mergeMap((services: IoTService[]) => {
            return [
              {
                type: fromIoTServiceActions.SET_IoTSERVICES,
                payload: services
              },
              {
                type: fromUserSpaceActions.NET_SUCCESS,
                payload: 'Retrieved User Owned Services to manage'
              }
            ];
          }),
          catchError(error => {
            return of({
              type: fromUserSpaceActions.NET_FAILED,
              payload: error
            });
          })
        );
      })
    );

  @Effect()
  uploadServiceFile = this.actions$
    .ofType(fromUserSpaceActions.UPLOAD_SERVICE_FILE)
    .pipe(
      map((action: fromUserSpaceActions.UploadServiceFile) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([pload, state]) => {
        const user_id = state.userData.id;
        return this.service
          .uploadServiceFile(user_id, pload.service_id, pload.uploadData)
          .pipe(
            mergeMap((response: number) => { // the id of the service with file upload
              return [
                {
                  type: fromIoTServiceActions.SERVICE_FILE_UPLOADED,
                  payload: response // or pload.service_id, and then we can use in service reportProgress
                },
                {
                  type: fromUserSpaceActions.NET_SUCCESS,
                  payload: 'File successfully uploaded'
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromUserSpaceActions.NET_FAILED,
                payload: error
              });
            })
          );
      })
    );

@Effect()
StartTService = this.actions$
  .ofType(fromUserSpaceActions.START_SERVICE)
  .pipe(
    map((action: fromUserSpaceActions.StartService) => {
      return action.payload;
    }),
    withLatestFrom(this.store.select('auth')),
    switchMap(([pload, state]) => {
      const user_id = state.userData.id;
      return this.service
        .startService(
          user_id,
          pload.service_id,
          pload.serviceParam
        )
        .pipe(
          mergeMap(response => {
            // delay to dispatch update status action
            // so give time for backend action to have completed before retreiving new status
            setTimeout(() => {
              this.store.dispatch({ type: fromUserSpaceActions.GET_SERVICE_STATUS, payload: {service_id: response} });
            }, 500);
            return [
              {
                type: fromUserSpaceActions.NET_SUCCESS,
                payload: 'Trying to start service ...'
              },
            ];
          }),
          catchError(error => {
            return of(
              {
              type: fromUserSpaceActions.NET_FAILED,
              payload: error
            },
            {
              type: fromIoTServiceActions.UPDATE_SERVICE_STATUS,
              payload: {service_id: pload.service_id, status: false}
            }
            // { type: fromUserSpaceActions.GET_SERVICE_STATUS, payload: {service_id: error['pid']} }
          );
          })
        );
    })
  );

  @Effect()
  StopService = this.actions$
    .ofType(fromUserSpaceActions.STOP_SERVICE)
    .pipe(
      map((action: fromUserSpaceActions.StopService) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([pload, state]) => {
        const user_id = state.userData.id;
        return this.service
          .stopService(
            user_id,
            pload.service_id,
          )
          .pipe(
            mergeMap(response => {
            // delay to dispatch update status action
            // so give time for backend action to have completed before retreiving new status
              setTimeout(() => {
                this.store.dispatch({ type: fromUserSpaceActions.GET_SERVICE_STATUS, payload: {service_id: response} });
              }, 500);
              return [
                {
                  type: fromUserSpaceActions.NET_SUCCESS,
                  payload: 'Stopping Service.'
                },
              ];
            }),
            catchError(error => {
              return of({
                type: fromUserSpaceActions.NET_FAILED,
                payload: error
              });
            })
          );
      })
    );

    @Effect()
    GetServiceStatus = this.actions$
      .ofType(fromUserSpaceActions.GET_SERVICE_STATUS)
      .pipe(
        map((action: fromUserSpaceActions.GetServiceStatus) => {
          return action.payload;
        }),
        withLatestFrom(this.store.select('auth')),
        switchMap(([pload, state]) => {
          const user_id = state.userData.id;
          return this.service
            .getServiceStatus(
              user_id,
              pload.service_id,
            )
            .pipe(
              mergeMap(response => {
                return [
                  {
                    type: fromIoTServiceActions.UPDATE_SERVICE_STATUS,
                    payload: {service_id: pload.service_id, status: response}
                  },
                  {
                    type: fromUserSpaceActions.NET_SUCCESS,
                    payload: 'Service status updated'
                  }
                ];
              }),
              catchError(error => {
                return of({
                  type: fromUserSpaceActions.NET_FAILED,
                  payload: error
                });
              })
            );
        })
      );

  @Effect()
  exportUserServices = this.actions$
    .ofType(fromUserSpaceActions.EXPORT_SERVICES)
    .pipe(
      // map((action: fromUserSpaceActions.UploadServiceFile) => {
      //   return action.payload;
      // }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([pload, state]) => {
        const user_id = state.userData.id;
        return this.service
          .exportUserServices(user_id)
          .pipe(
            mergeMap((response: Blob) => {
              const blob = new Blob([response]);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.setAttribute('style', 'display: none');
              a.href = url;
              a.download = state.userData.username + '_services_export.json';
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
              return [
                {
                  type: fromUserSpaceActions.NET_SUCCESS,
                  payload: 'Services Exported'
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromUserSpaceActions.NET_FAILED,
                payload: {'message': 'Failed to download file.'}
              });
            })
          );
      })
    );

  @Effect()
  getServiceLogFile = this.actions$
    .ofType<fromUserSpaceActions.GetServiceLogFile>(fromUserSpaceActions.GET_SERVICE_LOG_FILE)
    .pipe(
      map((action) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([pload, state]) => {
        const user_id = state.userData.id;
        return this.service
          .getServiceLogFile(user_id, pload.service_id)
          .pipe(
            mergeMap((response: Blob) => {
              const blob = new Blob([response]);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.setAttribute('style', 'display: none');
              a.href = url;
              a.download = pload.service_id + '.log';
              a.click();
              window.URL.revokeObjectURL(url);
              a.remove();
              return [
                {
                  type: fromUserSpaceActions.NET_SUCCESS,
                  payload: 'Service log file downloaded'
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromUserSpaceActions.NET_FAILED,
                payload: {'message': 'Failed to get latest service log file. Have you run service at least once first?'}
                // payload: {'message': 'Failed to download file.'}
              });
            })
          );
      })
    );

  @Effect({ dispatch: false })
  failed = this.actions$
    .ofType(fromUserSpaceActions.NET_FAILED)
    .pipe(
      tap((action: fromUserSpaceActions.NetFailed) => {
        this.alertService.error(action.payload['message']);
      })
    );

  @Effect({ dispatch: false })
  success = this.actions$
    .ofType(fromUserSpaceActions.NET_SUCCESS)
    .pipe(
      tap((action: fromUserSpaceActions.NetSuccess) => {
        // this.router.navigate([action.payload.redirectUrl]);
        this.alertService.success(action.payload);
      })
    );
}
