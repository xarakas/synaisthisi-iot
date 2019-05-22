import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  private ngUnsubscribe = new Subject<boolean>();
  SubPermissionsText: string;
  PubPermissionsText: string;
  termsAccepted = false;
  topic_owner = false;

  constructor(
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    // const id = this.route.snapshot.params['id']; No we ned reactively
    this.route.params
      .subscribe((params: Params) => {
        this.termsAccepted = false;
        this.topic_owner = false;
        this.store.dispatch(new fromTopicActions.StartSelectTopic(+params['id']));
      });

      this.store.pipe(
        select(fromTopic.getTopicsState),
        takeUntil(this.ngUnsubscribe)
      )
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
          if (this.detailedTopic.can_pub && this.detailedTopic.can_sub) {
            this.topic_owner = true;
            console.log('TOPIC OWNER');
          } else {
            console.log('NOT TOPIC OWNER');
          }
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.store.dispatch(new fromTopicActions.StopEdit());
  }

  public r_btnState(): boolean {
    return this.termsAccepted;
  }

 // Request use of topic => sub rights
  public requestTopic(): void {
    this.store.dispatch(new fromTopicActions.RequestTopic(this.detailedTopic.id));
  }

  public deleteTopic(): void {
    this.store.dispatch(new fromTopicActions.DeleteTopic(this.detailedTopic.id));
    window.scroll(0, 0);
  }
}
