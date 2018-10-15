import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ProfileComponent } from './profile/profile.component';
import { UserSpaceService } from './user-space.service';
import { UserSpaceRoutingModule } from './user-space-routing.module';
import { ServiceManagementComponent } from './service-management/service-management.component';

@NgModule({
  imports: [
    CommonModule,
    UserSpaceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ProfileComponent, ServiceManagementComponent],
  providers: [
    UserSpaceService
  ]
})
export class UserSpaceModule { }
