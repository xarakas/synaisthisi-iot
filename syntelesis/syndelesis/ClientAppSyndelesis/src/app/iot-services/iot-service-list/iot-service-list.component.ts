import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable ,  Subject ,  combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IoTService } from '../iot-service.model';
import * as fromApp from '../../store/app.reducers';
import { getServices } from '../store/iot-service.reducers';
import * as fromIoTServiceActions from '../store/iot-service.actions';

@Component({
  selector: 'app-iot-service-list',
  templateUrl: './iot-service-list.component.html',
  styleUrls: ['./iot-service-list.component.css']
})
export class IoTServiceListComponent implements OnInit, OnDestroy {
  private serviceState$: Observable<IoTService[]>;
  private pageEmitter$ = new Subject<boolean>();
  private ngUnsubscribe = new Subject<boolean>();

  public pagedServices: IoTService[];
  private startIndex = 0;
  public pageLength = 9;
  public servicesLength;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.store.dispatch(new fromIoTServiceActions.FetchIoTServices());
    this.serviceState$ = this.store.pipe(
      select(getServices)
      );

    combineLatest(this.serviceState$, this.pageEmitter$).pipe(
      takeUntil(this.ngUnsubscribe)
      ).subscribe(
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setPage(up: boolean) { // up: true/false means next/previous page
    this.pageEmitter$.next(up);
  }

}
