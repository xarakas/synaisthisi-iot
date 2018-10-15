import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iot-service-list-container',
  templateUrl: './iot-service-list-container.component.html',
  styleUrls: ['./iot-service-list-container.component.css']
})
export class IotServiceListContainerComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute ) { }

  public searchType = 'service';

  ngOnInit() {
  }
  onNewIoTService() {
    this.router.navigate(['new'] , { relativeTo: this.route });
  }
}
