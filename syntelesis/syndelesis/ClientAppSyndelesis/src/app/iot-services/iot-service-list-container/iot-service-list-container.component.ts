import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducers';
import * as fromIoTServiceActions from '../store/iot-service.actions';
import { getServiceOntology } from '../store/iot-service.reducers';

@Component({
  selector: 'app-iot-service-list-container',
  templateUrl: './iot-service-list-container.component.html',
  styleUrls: ['./iot-service-list-container.component.css']
})
export class IotServiceListContainerComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  public searchType = 'service';
  public serviceOntology: string[];
  public selectedOntology: string;

  ngOnInit() {}

  ontologyOpened() {
    this.store.pipe(
      select(getServiceOntology),
      map(arr => arr.sort())
      ).subscribe((s_ontology: string[]) => {
        this.serviceOntology = s_ontology;
        if (this.serviceOntology.length === 0) {
          this.store.dispatch(new fromIoTServiceActions.GetServiceOntology());
        }
      });
  }

  onSelectOntology() {
    console.log('Value selected: ', this.selectedOntology);
    this.store.dispatch(new fromIoTServiceActions.FetchIoTServices(this.selectedOntology));
  }

  onNewIoTService() {
    this.router.navigate(['new'] , { relativeTo: this.route });
  }
}
