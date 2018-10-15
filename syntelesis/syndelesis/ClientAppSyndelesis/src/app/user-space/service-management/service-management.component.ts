import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';

import { Observable ,  Subject ,  combineLatest } from 'rxjs';

import * as fromApp from '../../store/app.reducers';
import { IoTService } from '../../iot-services/iot-service.model';
import * as fromUSerSpaceActions from '../store/user-space.actions';

@Component({
  selector: 'app-service-management',
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css']
})
export class ServiceManagementComponent implements OnInit {
  private serviceState$: Observable<IoTService[]>;
  public pagedServices: IoTService[];
  pageEmitter$ = new Subject<boolean>();

  private startIndex = 0;
  private pageLength = 8;
  public servicesLength;

  public columnHeaders = [
    'name',
    'description',
    'service file',
    'run params',
    'status',
    'start/stop'
  ];

  constructor(private router: Router, private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new fromUSerSpaceActions.GetUserOwnedServices());
    this.serviceState$ = this.store.select('services', 'services');

    const combined = combineLatest(this.serviceState$, this.pageEmitter$);
    const subscribe = combined.subscribe(([p_services, pagerValue]) => {
      this.servicesLength = p_services.length;
      if (pagerValue) {
        if (this.startIndex < this.servicesLength - this.pageLength) {
          this.startIndex += this.pageLength;
        }
      } else {
        if (this.startIndex > this.pageLength) {
          this.startIndex -= this.pageLength;
        } else {
          this.startIndex = 0;
        }
      }
      this.pagedServices = p_services.slice(
        this.startIndex,
        this.startIndex + this.pageLength
      );
    });
    this.pageEmitter$.next(false); // needed the first time we land here,
    // to get things started, as combine kicks off when all subscribed have fired
  }

  setPage(up: boolean) {
    // up: true/false means next/previous page
    this.pageEmitter$.next(up);
  }

  onFileChanged(event, service_id) {
    const selectedFile = <File>event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('service_file', selectedFile, selectedFile.name);
    this.store.dispatch(
      new fromUSerSpaceActions.UploadServiceFile({ service_id, uploadData })
    );
  }

  onToggleService(service_id: number, start: boolean, paramString: string) {
    if (start) {
      this.store.dispatch(
        new fromUSerSpaceActions.StartService({
          service_id: service_id,
          serviceParam: paramString
        })
      );
    } else {
      this.store.dispatch(
        new fromUSerSpaceActions.StopService({
          service_id: service_id
        })
      );
    }
  }

  onItemSelected(item: IoTService) {
    this.store.dispatch(
      new fromUSerSpaceActions.GetServiceLogFile({
        service_id: item.id
      })
    );
  }

}
