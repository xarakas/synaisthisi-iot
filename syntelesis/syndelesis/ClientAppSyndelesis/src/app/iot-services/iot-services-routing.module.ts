import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { IotServiceListContainerComponent } from './iot-service-list-container/iot-service-list-container.component';
import { IotServicesComponent } from './iot-services.component';
import { IotServicesStartComponent } from './iot-services-start/iot-services-start.component';
import { IoTServiceDetailComponent } from './iot-service-detail/iot-service-detail.component';
import { IotServiceNewComponent } from './iot-service-new/iot-service-new.component';

const serviceRoutes: Routes = [
    {path: 'services', component: IotServicesComponent, children: [
        {
            path: 'new', component: IotServiceNewComponent, canActivate: [AuthGuardService]  // this SHOULD be first
        },
        {
        path: '', component: IotServiceListContainerComponent, children: [
            {path: '', component: IotServicesStartComponent},
            {path: ':id', component: IoTServiceDetailComponent, canActivate: [AuthGuardService]},
        ]
        }
     ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(serviceRoutes)],
    exports: [RouterModule],
    providers: [
        AuthGuardService
    ]
})
export class IotServicesRoutingModule {}
