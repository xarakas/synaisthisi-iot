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
import * as fromUserSpaceActions from './user-space.actions';
import { UserSpaceService } from '../user-space.service';
import { AlertService } from '../../shared/alert.service';
import { UserData } from '../../shared/authData.model';


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
