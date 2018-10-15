import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuthActions from '../store/auth.actions';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public loading$: Observable<boolean>;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.loading$ = this.store.select(fromApp.getAuthLoading);
  }

  onSignup(form: NgForm) {
    const email = form.value.email;
    const password = form.value.password;
    const username = form.value.username;
    this.store.dispatch(new fromAuthActions.DoSignup({email: email,
                                                      password: password,
                                                      username: username}));
  }

}
