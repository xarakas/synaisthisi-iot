import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { ProfileComponent } from './profile/profile.component';


const userSpaceRoutes: Routes = [
    { path: '', canActivate: [AuthGuardService], children: [
        {
            path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService]
        }
    ]
}
];


@NgModule({
    imports: [RouterModule.forChild(userSpaceRoutes)],
    exports: [RouterModule],
    providers: [
        AuthGuardService
    ]
})
export class UserSpaceRoutingModule {}
