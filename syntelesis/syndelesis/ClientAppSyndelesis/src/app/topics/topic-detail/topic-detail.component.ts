import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';

import { Topic } from '../../shared/topic.model';
import * as fromApp from '../../store/app.reducers';
import * as fromTopic from '../store/topic.reducers';
import * as fromTopicActions from '../store/topic.actions';


@Component({
  selector: 'app-topic-detail',
  templateUrl: './topic-detail.component.html',
  styleUrls: ['./topic-detail.component.css']
})
export class TopicDetailComponent implements OnInit, OnDestroy {
  id: number;
  public detailedTopic: Topic;
  // topicState$: Observable<fromTopic.State>;
  // detailedTopic$: Observable<DetailedTopicModel>;
  SubPermissionsText: string;
  PubPermissionsText: string;
  termsAccepted = false;
  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // const id = this.route.snapshot.params['id']; No we ned reacively
    this.route.params
      .subscribe((params: Params) => {
        this.termsAccepted = false;
        this.store.dispatch(new fromTopicActions.StartSelectTopic(+params['id']));
      });

      this.subscription = this.store.select('topics')
      .subscribe((topic$: fromTopic.State) => {
        this.detailedTopic = topic$.editedTopic;
        if (this.detailedTopic) {
          if (this.detailedTopic.can_sub) {
              this.SubPermissionsText = 'Permitted to Subscribe !';
            }else {
              this.SubPermissionsText = 'Not permitted to Subscribe to this topic';
            }
            if (this.detailedTopic.can_pub) {
              this.PubPermissionsText = 'Permitted to Publish !';
            }else {
              this.PubPermissionsText = 'Not Permitted To Publish on this topic';
          }
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new fromTopicActions.StopEdit());
  }

  public r_btnState(): boolean {
    return this.termsAccepted;
  }

 // Request use of topic => sub rights
  public requestTopic(): void {
    this.store.dispatch(new fromTopicActions.RequestTopic(this.detailedTopic.id));
  }

}
