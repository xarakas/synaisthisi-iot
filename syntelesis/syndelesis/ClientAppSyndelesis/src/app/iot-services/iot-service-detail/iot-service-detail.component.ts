import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { IoTService } from '../iot-service.model';
import * as fromApp from '../../store/app.reducers';
import * as fromIoTService from '../store/iot-service.reducers';
import * as fromIoTActions from '../store/iot-service.actions';


@Component({
  selector: 'app-iot-service-detail',
  templateUrl: './iot-service-detail.component.html',
  styleUrls: ['./iot-service-detail.component.css']
})
export class IoTServiceDetailComponent implements OnInit, OnDestroy {
  public detailedIoTService: IoTService;
  public permissionsText: string;
  public termsAccepted = false;
  subscription: Subscription;
  public showTopicState = {
    inputs: false,
    outputs: false
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.termsAccepted = false;
        this.store.dispatch(new fromIoTActions.StartSelectIoTService(+params['id']));
      });

      this.subscription = this.store.select('services')
      .subscribe((iotService$: fromIoTService.State) => {
        this.detailedIoTService = iotService$.selectedService;
        if (this.detailedIoTService) {
          if (this.detailedIoTService.subscriber) {
              this.permissionsText = 'I can use this service.';
            }else {
              this.permissionsText = 'Please accept terms and request service usage.';
            }
          }
      });
  }

  ngOnDestroy() {
    this.showTopicState = {inputs:false, outputs: false}
    this.subscription.unsubscribe();
    this.store.dispatch(new fromIoTActions.StopSelectIoTService());
  }

  onShowTopicsChange(state: number) {
    switch (state) {
      case 1:
        this.showTopicState = {inputs: true, outputs: false};
        break;
      case 2:
        this.showTopicState = {inputs: false, outputs: true};
        break;
      case 3:
        this.showTopicState = {inputs: true, outputs: true};
        break;
      case 4:
        this.showTopicState = {inputs: false, outputs: false};
        break;
    }
  }

  onNavigateToTopic(topicId) {
    this.router.navigate(['/topics/', topicId])
  }

  r_btnState(): boolean {
    return this.termsAccepted;
  }

 // Request use of topic => sub rights
  requestIoTService(): void {
    this.store.dispatch(new fromIoTActions.RequestIoTService(this.detailedIoTService.id));
  }

}
