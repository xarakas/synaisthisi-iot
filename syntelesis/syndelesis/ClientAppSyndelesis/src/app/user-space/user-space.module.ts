import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { ProfileComponent } from './profile/profile.component';
import { UserSpaceService } from './user-space.service';
import { UserSpaceRoutingModule } from './user-space-routing.module';
import { UserSpaceEffects } from './store/user-space.effects';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserSpaceRoutingModule,
    EffectsModule.forFeature([UserSpaceEffects])
  ],
  declarations: [ProfileComponent],
  providers: [
    UserSpaceService
  ]
})
export class UserSpaceModule { }
