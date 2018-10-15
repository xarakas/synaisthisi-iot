import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { ServiceManagementComponent } from './service-management/service-management.component';

const userSpaceRoutes: Routes = [
    { path: 'user/profile', component: ProfileComponent, canActivate: [AuthGuardService] },
    { path: 'user/services/management', component: ServiceManagementComponent, canActivate: [AuthGuardService] }
];


@NgModule({
    imports: [RouterModule.forChild(userSpaceRoutes)],
    exports: [RouterModule],
    providers: [
        AuthGuardService
    ]
})
export class UserSpaceRoutingModule {}