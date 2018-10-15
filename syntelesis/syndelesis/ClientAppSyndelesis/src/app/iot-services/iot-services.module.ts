import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IotServicesRoutingModule } from './iot-services-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IoTServicesService } from './iot-services.service';
import { IotServicesComponent } from './iot-services.component';
import { IotServiceListContainerComponent } from './iot-service-list-container/iot-service-list-container.component';
import { IotServicesStartComponent } from './iot-services-start/iot-services-start.component';
import { IoTServiceListComponent } from './iot-service-list/iot-service-list.component';
import { IoTServiceItemComponent } from './iot-service-list/iot-service-item/iot-service-item.component';
import { IoTServiceDetailComponent } from './iot-service-detail/iot-service-detail.component';
import { IotServiceNewComponent } from './iot-service-new/iot-service-new.component';
import { TopicsModule } from '../topics/topics.module';

@NgModule({
  imports: [
    CommonModule,
    IotServicesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TopicsModule
  ],
  declarations: [
    IotServicesComponent,
    IotServiceListContainerComponent,
    IotServicesStartComponent,
    IoTServiceListComponent,
    IoTServiceItemComponent,
    IotServicesComponent,
    IoTServiceDetailComponent,
    IotServiceNewComponent,
  ],
  providers: [
    IoTServicesService
  ]
})
export class IotServicesModule { }
