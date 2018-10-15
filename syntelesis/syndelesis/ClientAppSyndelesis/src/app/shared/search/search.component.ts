import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';

import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

import { Store } from '@ngrx/store';

import * as fromTopicActions from '../../topics/store/topic.actions';
import * as fromIoTServiceActions from '../../iot-services/store/iot-service.actions';
import * as fromApp from '../../store/app.reducers';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnChanges {
  @Input() searchType: string;

  public placeholderText: string;
  private checkType: string;
  private dispachedSearchAction: fromTopicActions.Search | fromIoTServiceActions.FetchIoTServices;
  private searchTerms$ = new Subject<string>();

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['moduleType']) {
      this.checkType = this.searchType;
    }
  }

  ngOnInit() {
    switch (this.searchType) {
      case 'topic':
        this.placeholderText = 'Search in topics...';
        this.dispachedSearchAction = new fromTopicActions.Search('');
        break;
      case 'service':
        this.placeholderText = 'Search in services...';
        this.dispachedSearchAction = new fromIoTServiceActions.FetchIoTServices();
        break;
    }
    this.searchTerms$.pipe(
      debounceTime(300),        // wait for 300ms pause in events
      distinctUntilChanged()  // ignore if next search term is same as previous
      )
      .subscribe((term: string) => {
        this.dispachedSearchAction.payload = term;
        this.store.dispatch(this.dispachedSearchAction);
        // this.store.dispatch(new fromTopicActions.Search(term));
      }
    );

  }

  search(term: string): void {
    this.searchTerms$.next(term);
  }

}
