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

import { ServicesState, serviceReducer } from './iot-service.reducers';
import * as fromIoTServiceActions from './iot-service.actions';
import { IoTService } from '../iot-service.model';
import { IoTServicesService } from '../iot-services.service';
import { AlertService } from '../../shared/alert.service';
import { environment } from '../../../environments/environment';


@Injectable()
export class IoTServiceEffects {
  private url = environment.apiUrl;

  constructor(
    private actions$: Actions,
    private service: IoTServicesService,
    private store: Store<ServicesState>,
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

    @Effect()
    deleteIoTService = this.actions$.pipe(
      ofType(fromIoTServiceActions.DELETE_IoTSERVICE),
      map((action: fromIoTServiceActions.DeleteIoTService) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([service_id, state]) => {
        // const user_id = state.userData.id;
        return this.service.deleteIoTService(service_id).pipe(
          mergeMap((response: string) => {
            console.log(response);
            return [
              {
                type: fromIoTServiceActions.STOP_DELETE_IoTSERVICE,
                payload: service_id
              },
              {
                type: fromIoTServiceActions.REDIRECT,
                payload: 'services'
              },
              // {
              //   type: fromIoTServiceActions.FETCH_IoTSERVICES,
              //   payload: ''
              // },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: { message: response['message'] }
              }
            ];
          }),
          catchError(error => {
            return of({ type: fromIoTServiceActions.NET_FAILED, payload: error });
          })
        );
      })
    );


// #### SERVICE MANAGEMENT


  @Effect()
  userServicesFetch = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.GET_USER_OWNED_SERVICES),
      map((action: fromIoTServiceActions.GetUserOwnedServices) => {
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
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: {message: 'Retrieved User Owned Services to manage'}
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
  uploadServiceFile = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.UPLOAD_SERVICE_FILE),
      map((action: fromIoTServiceActions.UploadServiceFile) => {
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
                  type: fromIoTServiceActions.NET_SUCCESS,
                  payload: {message: 'File successfully uploaded'}
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
  StartTService = this.actions$
  .pipe(
    ofType(fromIoTServiceActions.START_SERVICE),
    map((action: fromIoTServiceActions.StartService) => {
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
              this.store.dispatch({ type: fromIoTServiceActions.GET_SERVICE_STATUS, payload: {service_id: response} });
            }, 500);
            return [
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: {message: 'Trying to start service ...'}
              },
            ];
          }),
          catchError(error => {
            return of(
              {
              type: fromIoTServiceActions.NET_FAILED,
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
    .pipe(
      ofType(fromIoTServiceActions.STOP_SERVICE),
      map((action: fromIoTServiceActions.StopService) => {
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
                this.store.dispatch({ type: fromIoTServiceActions.GET_SERVICE_STATUS, payload: {service_id: response} });
              }, 500);
              return [
                {
                  type: fromIoTServiceActions.NET_SUCCESS,
                  payload: {message: 'Stopping Service.'}
                },
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
    GetServiceStatus = this.actions$
      .pipe(
        ofType(fromIoTServiceActions.GET_SERVICE_STATUS),
        map((action: fromIoTServiceActions.GetServiceStatus) => {
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
                    type: fromIoTServiceActions.NET_SUCCESS,
                    payload: {message: 'Service status updated'}
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
  exportUserServices = this.actions$
    .pipe(
      ofType(fromIoTServiceActions.EXPORT_SERVICES),
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
                  type: fromIoTServiceActions.NET_SUCCESS,
                  payload: {message: 'Services Exported'}
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromIoTServiceActions.NET_FAILED,
                payload: {'message': 'Failed to download file.'}
              });
            })
          );
      })
    );

    @Effect()
    importServicesFile = this.actions$
      .pipe(
        ofType(fromIoTServiceActions.IMPORT_SERVICES),
        map((action: fromIoTServiceActions.ImportUserServices) => {
          return action.payload;
        }),
        withLatestFrom(this.store.select('auth')),
        switchMap(([pload, state]) => {
          const user_id = state.userData.id;
          return this.service
            .importUserServices(user_id, pload.uploadData)
            .pipe(
              mergeMap((response: number) => { // the id of the service with file upload
                return [
                  // {
                  //   type: fromIoTServiceActions.SERVICE_FILE_UPLOADED,
                  //   payload: response // or pload.service_id, and then we can use in service reportProgress
                  // },
                  {
                    type: fromIoTServiceActions.NET_SUCCESS,
                    payload: {message: 'Services successfully imported'}
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
  getServiceLogFile = this.actions$
    .pipe(
      ofType<fromIoTServiceActions.GetServiceLogFile>(fromIoTServiceActions.GET_SERVICE_LOG_FILE),
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
                  type: fromIoTServiceActions.NET_SUCCESS,
                  payload: {message: 'Service log file downloaded'}
                }
              ];
            }),
            catchError(error => {
              return of({
                type: fromIoTServiceActions.NET_FAILED,
                payload: {'message': 'Failed to get latest service log file. Have you run service at least once first?'}
                // payload: {'message': 'Failed to download file.'}
              });
            })
          );
      })
    );
// ##### END SERVICE MANAGEMENT

// ##### SERVICE ONTOLOGY
@Effect()
  getServiceOntology = this.actions$
    .pipe(
      ofType<fromIoTServiceActions.GetServiceOntology>(fromIoTServiceActions.GET_SERVICE_ONTOLOGY),
      switchMap((action) => {
        return this.service.getServicesOntology().pipe(
          mergeMap((ontology: string[]) => {
            return [
              {
                type: fromIoTServiceActions.SET_SERVICE_ONTOLOGY,
                payload: ontology['data']
              },
              {
                type: fromIoTServiceActions.NET_SUCCESS,
                payload: {
                  message: 'Retrieved services ontology',
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
// ##### END SERVICE ONTOLOGY

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
