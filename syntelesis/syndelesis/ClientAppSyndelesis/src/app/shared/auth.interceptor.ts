
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpInterceptor,
         HttpRequest,
         HttpHandler,
         HttpEvent
        } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { catchError, switchMap, take, skipWhile } from 'rxjs/operators';


import { HttpErrorResponse } from '@angular/common/http';
import * as fromAuthActions from '../auth/store/auth.actions';

import * as fromApp from '../store/app.reducers';
import * as fromAuth from '../auth/store/auth.reducers';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private store: Store<fromApp.AppState>, private router: Router) {}

    addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
        return req.clone({ setHeaders: { Authorization: 'Bearer ' + token }});
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth')
        .pipe(
            take(1), // if... needed
            switchMap((authState: fromAuth.State) => {
                if (req.url === 'refresh') {
                    return next.handle(this.addToken(req, authState.refreshToken));
                    // return next.handle(this.addToken(req, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
                    // + '.eyJleHAiOjE1MzA4NzcyNDAsImlhdCI6MTUyODI4NTI0MCwibmJmIjoxNTI4Mjg1MjQwLCJq'
                    // + 'dGkiOiIwMDUxYjk0Ny0zNWJhLTQ4MWMtYTBkOC1iNGYyMjNiNDhiNzgiLCJpZGVudGl0eSI6MiwidHlwZSI6InJlZnJlc2gifQ'
                    // + '.p2jep1H5g_76s6vTpa8R9x2sDyNIXByx8cYfoYuKS1c'))
                }
                // return next.handle(this.addToken(req, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
                // + '.eyJleHAiOjE1MjgyODYxNDAsImlhdCI6MTUyODI4NTI0MCwibmJmIjoxNTI4Mjg1MjQwLCJ'
                // + 'qdGkiOiIxOGRiMTcxYS04OGRjLTQxOWItYWRiNi1kMDNmZjJhZDhjNWUiLCJpZGVudGl0eSI6'
                // + 'MiwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJ1c2VybmFtZ'
                // + 'SI6ImRhdF92cGl0c2lsaXMiLCJlbWFpbCI6InZwaXRzaWxpc0BkYXQuZGVtb2tyaXRvcy5nciIsImFkbWluIjpmYWxzZX19'
                // + '.cSQ0C7uNpqN92Qig88tT1xvi7CMmHTzhpsSTuC8vo0s'))
                return next.handle(this.addToken(req, authState.token))
                .pipe(
                    catchError((response) => {
                        if (response instanceof HttpErrorResponse) {
                            // DEBUG important
                            // console.log(response);
                            switch ((<HttpErrorResponse>response).status) {
                                case 0:
                                    // console.log(0);
                                    break;
                                case 400:
                                    // console.log(400);
                                    break;
                                case 401:
                                    // console.log(401);
                                    // 401 error due to expired jwt
                                    if (response.error['code'] === 'TOKEN_EXPIRED') {
                                        return this.handle401Error(req, next);
                                    }
                                    // 401 error due to endpoint needs fresh jwt (we just have a jwt with ['fresh': false])
                                    if (response.error['code'] === 'FRESH_TOKEN_REQUIRED') {
                                        this.router.navigate(['signin'], { queryParams: { returnUrl: this.router.url}});
                                    }
                                    break;
                                case 500:
                                    // console.log(500);
                                    break;
                                default:
                                    // console.log('Default');
                                    break;
                                // throw error again after any processiong done
                            }
                            return observableThrowError(response);
                        } else {
                            // console.log('ERRROR: ' + response);
                            return observableThrowError(response);
                        }
                    })
                );
            })
        );
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {

        this.store.dispatch(new fromAuthActions.RefreshToken);

        return this.store.select('auth')
            .pipe(
                skipWhile(authS => authS.refreshing === true), // filter(authS => authS.refreshing != true)
                take(1), // if... needed
                switchMap((authState: fromAuth.State) => {
                    return next.handle(this.addToken(req, authState.token))
                    // return next.handle(this.addToken(req, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
                    // + '.eyJleHAiOjE1MjgyODYxNDAsImlhdCI6MTUyODI4NTI0MCwibmJmIjoxNTI4Mjg1MjQwLCJ'
                    // + 'qdGkiOiIxOGRiMTcxYS04OGRjLTQxOWItYWRiNi1kMDNmZjJhZDhjNWUiLCJpZGVudGl0eSI'
                    // + '6MiwiZnJlc2giOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJ1c2VyX2NsYWltcyI6eyJ1c2VybmFt'
                    // + 'ZSI6ImRhdF92cGl0c2lsaXMiLCJlbWFpbCI6InZwaXRzaWxpc0BkYXQuZGVtb2tyaXRvcy5nciIsImFkbWluIjpmYWxzZX19'
                    // + '.cSQ0C7uNpqN92Qig88tT1xvi7CMmHTzhpsSTuC8vo0s'))
                    .pipe(
                        catchError((error) => {
                            // return this.store.dispatch(new fromAuthActions.Logout);
                            return observableThrowError(error);
                        })
                    );
                })
            );
    }

}
