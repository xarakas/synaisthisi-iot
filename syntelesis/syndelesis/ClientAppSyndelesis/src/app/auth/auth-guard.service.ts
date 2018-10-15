
import {take, map } from 'rxjs/operators';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';



import * as fromApp from '../store/app.reducers';
import * as fromAuth from './store/auth.reducers';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('auth')
      .pipe(
        take(1),
        map((authState: fromAuth.State) => {
          if (authState.authenticated) {
            return true;
          } else {
            this.router.navigate(['signin'], { queryParams: { returnUrl: state.url }});
            return false;
          }
        })
      );
  }
}
