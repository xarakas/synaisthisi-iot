import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from '../auth/auth-guard.service';
import { IotServiceListContainerComponent } from './iot-service-list-container/iot-service-list-container.component';
import { IotServicesComponent } from './iot-services.component';
import { IotServicesStartComponent } from './iot-services-start/iot-services-start.component';
import { IoTServiceDetailComponent } from './iot-service-detail/iot-service-detail.component';
import { IotServiceNewComponent } from './iot-service-new/iot-service-new.component';
import { ServiceManagementComponent } from './service-management/service-management.component';
import { AuthModule } from '../auth/auth.module';


const serviceRoutes: Routes = [
    {path: '', component: IotServicesComponent, children: [
        {
            path: 'new', component: IotServiceNewComponent, canActivate: [AuthGuardService]  // this SHOULD be first
        },
        {
            path: 'management', component: ServiceManagementComponent, canActivate: [AuthGuardService], children: [
            ]
        },
        // {
        //     path: '', component: IotServiceListContainerComponent, children: [
        //         {path: '', component: IotServicesStartComponent},
        //         {path: ':id', component: IoTServiceDetailComponent, canActivate: [AuthGuardService]},
        //     ]
        // }
        {
          path: '', component: IotServiceListContainerComponent
        },
        {
          path: ':id', component: IoTServiceDetailComponent, canActivate: [AuthGuardService]
        }
     ]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(serviceRoutes),
        AuthModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuardService
    ]
})
export class IotServicesRoutingModule {}
