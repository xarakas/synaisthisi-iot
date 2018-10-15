import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import { UserData } from '../../shared/authData.model';
import * as fromUserSpaceActions from '../store/user-space.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild('f') userProfileForm: NgForm;
  userData$: Observable<UserData>;

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  ngOnInit() {
    this.store.dispatch(new fromUserSpaceActions.GetUserData());
    this.userData$ = this.store.select(fromApp.getUserData);
  }

  onUpdateUser() {
    this.store.dispatch(
      new fromUserSpaceActions.UpdateUserData(this.userProfileForm.value)
    );
  }

  onCancel() {
    this.router.navigate(['']);
  }
}
