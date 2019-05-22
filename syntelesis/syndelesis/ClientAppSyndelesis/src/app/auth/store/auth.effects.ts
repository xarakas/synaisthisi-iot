import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import {
  map,
  switchMap,
  mergeMap,
  withLatestFrom,
  catchError,
  tap
} from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import * as fromAuthActions from './auth.actions';
import * as fromIoTServiceActions from '../../iot-services/store/iot-service.actions';
import * as fromTopicActions from '../../topics/store/topic.actions';
import { AuthService } from '../auth.service';
import { AlertService } from '../../shared/alert.service';
import { AuthResponse } from '../../shared/authData.model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private alertService: AlertService
  ) {}

  @Effect()
  authSignup = this.actions$.pipe(
    ofType<fromAuthActions.DoSignup>(fromAuthActions.DO_SIGNUP),
    map(action => action.payload),
    switchMap(
      (authData) => {
        return this.authService.signUpUser(authData).pipe(
          mergeMap((response: AuthResponse) => {
            return [
              {
                type: fromAuthActions.SIGNUP
              },
              {
                type: fromAuthActions.SET_TOKEN,
                payload: response.access_token
              },
              {
                type: fromAuthActions.SET_REFRESH_TOKEN,
                payload: response.refresh_token
              },
              {
                type: fromAuthActions.SET_USERDATA,
                payload: response.data
              },
              {
                type: fromAuthActions.AUTH_SUCCESS,
                payload: {
                  message:
                    'Account successfully created. Welcome to Syndelesis.',
                  redirectUrl: '/'
                }
              }
            ];
          }),
          catchError(error => {
            return of({ type: fromAuthActions.AUTH_FAILED, payload: error });
          })
        );
      }
    )
  );

  @Effect()
  authSignIn = this.actions$.pipe(
    ofType<fromAuthActions.DoSignin>(fromAuthActions.DO_SIGNIN),
    map(action => action.payload),
    switchMap(
      (authData) => {
        const navigateUrl = authData.navigateUrl;
        return this.authService
          .signInUser({
            username: authData.username,
            password: authData.password
          })
          .pipe(
            mergeMap((response: AuthResponse) => {
              return [
                {
                  type: fromAuthActions.SIGNIN
                },
                {
                  type: fromAuthActions.SET_TOKEN,
                  payload: response.access_token
                },
                {
                  type: fromAuthActions.SET_REFRESH_TOKEN,
                  payload: response.refresh_token
                },
                {
                  type: fromAuthActions.SET_USERDATA,
                  payload: response.data
                }
              ];
            }),
            tap(() => this.router.navigate([navigateUrl])),
            catchError(error => {
              return of({ type: fromAuthActions.AUTH_FAILED, payload: error });
            })
          );
      }
    )
  );

  @Effect()
  authRefreshToken = this.actions$.pipe(
    ofType<fromAuthActions.RefreshToken>(fromAuthActions.REFRESH_TOKEN),
    switchMap(() => {
      return this.authService.refreshToken().pipe(
        mergeMap((response: AuthResponse) => {
          return [
            {
              type: fromAuthActions.SET_TOKEN,
              payload: response.access_token
            }
          ];
        }),
        catchError(error => {
          // Refresh token failed too (e.g expired or revoked)
          this.router.navigate(['signin'], {
            queryParams: { returnUrl: this.router.url }
          });
          return of(
            { type: fromAuthActions.LOGOUT },
            { type: fromIoTServiceActions.CLEAR_IoT_SERVICES_STATE },
            { type: fromTopicActions.CLEAR_TOPICS_STATE }
          );
        })
      );
    })
  );

  @Effect()
  authLogout = this.actions$.pipe(
    ofType<fromAuthActions.DoLogout>(fromAuthActions.DO_LOGOUT),
    withLatestFrom(this.store.select('auth')),
    switchMap(([action, state]) => {
      return this.authService.logOut(state.refreshToken).pipe(
        mergeMap((response: AuthResponse) => {
          return [
            {
              type: fromAuthActions.LOGOUT
            },
            {
              type: fromIoTServiceActions.CLEAR_IoT_SERVICES_STATE
            },
            {
              type: fromTopicActions.CLEAR_TOPICS_STATE
            }
          ];
        }),
        tap(() => {
          this.router.navigate(['/']);
        }),
        catchError(error => {
          return of({ type: fromAuthActions.AUTH_FAILED, payload: error });
        })
      );
    })
  );

  @Effect({ dispatch: false })
  failed = this.actions$.pipe(
    ofType<fromAuthActions.AuthFailed>(fromAuthActions.AUTH_FAILED),
    tap((action) => {
      //    console.log(action.payload);
      this.alertService.error(action.payload['message']);
    })
  );

  @Effect({ dispatch: false })
  success = this.actions$.pipe(
    ofType<fromAuthActions.AuthSuccess>(fromAuthActions.AUTH_SUCCESS),
    tap((action) => {
      this.router.navigate([action.payload.redirectUrl]);
      this.alertService.success(action.payload.message);
    })
  );
}
