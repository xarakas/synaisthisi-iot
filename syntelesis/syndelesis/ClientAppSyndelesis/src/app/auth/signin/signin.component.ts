import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuthActions from '../store/auth.actions';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  private returnUrl: string;
  public loading$: Observable<boolean>;

  constructor(
              private store: Store<fromApp.AppState>,
              private router: Router,
              private route: ActivatedRoute,
              ) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.loading$ = this.store.select(fromApp.getAuthLoading);
  }

  onSignin(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    this.store.dispatch(new fromAuthActions.DoSignin({username: email, password: password, navigateUrl: this.returnUrl}));
  }

}
