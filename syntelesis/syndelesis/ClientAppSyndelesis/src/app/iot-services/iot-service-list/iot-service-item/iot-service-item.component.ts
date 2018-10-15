import { Component, OnInit, Input} from '@angular/core';

import { IoTService } from '../../iot-service.model';

@Component({
  selector: 'app-iot-service-item',
  templateUrl: './iot-service-item.component.html',
  styleUrls: ['./iot-service-item.component.css']
})
export class IoTServiceItemComponent implements OnInit {
  @Input() iot_service: IoTService;

  constructor() { }

  ngOnInit() {
  }

}
