import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

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
  private ngUnsubscribe = new Subject<boolean>();
  public showTopicState = {
    inputs: true,
    outputs: true
  };
  public service_owner = false;
  private current_user: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.route.params
    // Activated route among the few Observables that do not need unsubscribe (Router takes care)
      .subscribe((params: Params) => {
        this.termsAccepted = false;
        this.store.dispatch(new fromIoTActions.StartSelectIoTService(+params['id']));
      });

      this.store.pipe(
        select(fromApp.getUserData),
        take(1)
      ).subscribe((userData$) => {
        this.current_user = userData$.username;
      });

      this.store.pipe(
        select('services'),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((iotService$: fromIoTService.State) => {
        this.detailedIoTService = iotService$.selectedService;
        if (this.detailedIoTService) {
          if (this.detailedIoTService.subscriber) {
              this.permissionsText = 'Service subscription enabled.';
            }else {
              this.permissionsText = 'Accept terms of use in order to request service subscription.';
            }
          if (this.current_user === this.detailedIoTService.owner) {
              this.service_owner = true;
            } else {
              this.service_owner = false;
            }
          }
      });
  }

  ngOnDestroy() {
    this.showTopicState = {inputs: false, outputs: false};
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.router.navigate(['/topics/', topicId]);
  }

  r_btnState(): boolean {
    return this.termsAccepted;
  }

 // Request use of topic => sub rights
  requestIoTService(): void {
    this.store.dispatch(new fromIoTActions.RequestIoTService(this.detailedIoTService.id));
  }

  onDeleteService(): void {
    const id = this.detailedIoTService.id;
    this.store.dispatch(new fromIoTActions.DeleteIoTService(id));
  }

  onEditService() {}

}
