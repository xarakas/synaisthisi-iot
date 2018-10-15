import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable ,  Subject ,  combineLatest } from 'rxjs';

import { IoTService } from '../iot-service.model';
import * as fromApp from '../../store/app.reducers';
import * as fromIoTServiceActions from '../store/iot-service.actions';

@Component({
  selector: 'app-iot-service-list',
  templateUrl: './iot-service-list.component.html',
  styleUrls: ['./iot-service-list.component.css']
})
export class IoTServiceListComponent implements OnInit {
  private serviceState$: Observable<IoTService[]>;
  public pagedServices: IoTService[];
  pageEmitter$ = new Subject<boolean>();

  private startIndex = 0;
  private pageLength = 8;
  public servicesLength;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new fromIoTServiceActions.FetchIoTServices());
    this.serviceState$ = this.store.select('services', 'services');

    const combined = combineLatest(this.serviceState$, this.pageEmitter$);
    const subscribe = combined.subscribe(
      ([p_services, pagerValue]) => {
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
        if (this.startIndex > p_services.length) {
          this.startIndex = 0;
        }
        this.pagedServices = p_services.slice(this.startIndex, this.startIndex + this.pageLength);
      }
    );
    this.pageEmitter$.next(false); // needed the first time we land here,
                                   // to get things started, as combine kicks off when all subscribed have fired
  }

  setPage(up: boolean) { // up: true/false means next/previous page
    this.pageEmitter$.next(up);
  }

}
