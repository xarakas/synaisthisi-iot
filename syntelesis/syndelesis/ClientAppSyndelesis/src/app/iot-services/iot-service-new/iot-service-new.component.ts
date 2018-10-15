import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Topic } from '../../shared/topic.model';
import { IoTService } from '../iot-service.model';
import * as fromApp from '../../store/app.reducers';
import * as fromIoTServiceActions from '../store/iot-service.actions';

@Component({
  selector: 'app-iot-service-new',
  templateUrl: './iot-service-new.component.html',
  styleUrls: ['./iot-service-new.component.css']
})
export class IotServiceNewComponent implements OnInit {
  IoTServiceForm: FormGroup;
  searchType = 'topic';
  embeddingComponent = 'NewService';
  public service_types = ['Actuator', 'Sensor', 'Processor'];

  public showTopicState = {
    inputs: false,
    outputs: false,
    existing_inputs: false
  };

  constructor(private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const inputTopics = new FormArray([]);
    const outputTopics = new FormArray([]);

    this.IoTServiceForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required),
      'serviceType': new FormControl(null, Validators.required),
      'location' : new FormControl(null, Validators.required),
      'inputTopics': inputTopics,
      'outputTopics': outputTopics,
    });
  }


  onShowTopicsChange(state: number) {
    switch (state) {
      case 1:
        this.showTopicState = {inputs: true, outputs: false, existing_inputs: false};
        break;
      case 2:
        this.showTopicState = {inputs: false, outputs: true, existing_inputs: false};
        break;
      case 3:
        this.showTopicState = {inputs: true, outputs: true, existing_inputs: false};
        break;
      case 4:
        this.showTopicState = {inputs: false, outputs: false, existing_inputs: false};
        break;
      case 5:
        this.showTopicState = {inputs: true, outputs: false, existing_inputs: true};
        break;
    }
  }

  onAddInputTopic() {
    (<FormArray>this.IoTServiceForm.get('inputTopics')).push(
      new FormGroup({
        'name': new FormControl(null),
        'description': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteInputTopic(index: number) {
    (<FormArray>this.IoTServiceForm.get('inputTopics')).removeAt(index);
  }

  onAddOutputTopic() {
    (<FormArray>this.IoTServiceForm.get('outputTopics')).push(
      new FormGroup({
        'name': new FormControl(null),
        'description': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteOutputTopic(index: number) {
    (<FormArray>this.IoTServiceForm.get('outputTopics')).removeAt(index);
  }


  onAddExistingInputTopic(existingTopic: Topic) {
    (<FormArray>this.IoTServiceForm.get('inputTopics')).push(
      new FormGroup({
        'name': new FormControl(existingTopic.name),
        'description': new FormControl(existingTopic.description, Validators.required)
      })
    );
  }

  onCancel() {
    this.router.navigate(['services']);
  }

  onSubmit() {
    const newIoTService = new IoTService(
      this.IoTServiceForm.value['name'],
      this.IoTServiceForm.value['description'],
      this.IoTServiceForm.value['serviceType'],
      this.IoTServiceForm.value['location'],
    );
    newIoTService.input_topics = this.IoTServiceForm.value['inputTopics'];
    newIoTService.output_topics = this.IoTServiceForm.value['outputTopics'];

    this.store.dispatch(new fromIoTServiceActions.CreateIoTService(newIoTService));
    // this.onCancel();
  }

}
