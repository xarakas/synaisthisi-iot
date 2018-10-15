import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';

import { Topic } from '../../shared/topic.model';
import * as TopicActions from '../store/topic.actions';
import * as fromApp from '../../store/app.reducers';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.css']
})
export class TopicEditComponent {
  @ViewChild('f') slForm: NgForm;

  constructor(private store: Store<fromApp.AppState>) { }

  onSubmit() {
    const topicName = this.slForm.value.name;
    const topicDescription = this.slForm.value.description;
    const newTopic = new Topic(topicName, topicDescription);
    this.store.dispatch(new TopicActions.AddTopic(newTopic));
    this.onClear();
  }

  onClear() {
    this.slForm.reset();
  }

}
