import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable ,  Subscription ,  Subject ,  combineLatest } from 'rxjs';

import { Topic, TopicSearchType } from '../../shared/topic.model';
import * as fromApp from '../../store/app.reducers';
import * as fromTopicActions from '../store/topic.actions';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit {
  // The following two are used to act upon topic selection when copmonent embedded in New Service Component
  @Input() embeddingComponent: string = null;
  @Output() topicSelected = new EventEmitter<Topic>();

  private topicsState$: Observable<Topic[]>;
  public pagedTopics: Topic[];
  subscription: Subscription;
  pageEmitter = new Subject<boolean>();

  private startIndex = 0;
  public pageLength = 8;
  public topicsLength;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    switch (this.embeddingComponent) {
      case 'NewService':
        this.store.dispatch(new fromTopicActions.FetchTopics(TopicSearchType.userSubPermittedTopics));
        break;
      default:
        this.store.dispatch(new fromTopicActions.FetchTopics(TopicSearchType.allTopics));
    }
    this.topicsState$ = this.store.select('topics', 'topics');

    const combined = combineLatest(this.topicsState$, this.pageEmitter);
    const subscribe = combined.subscribe(
      ([p_topics, pagerValue]) => {
        this.topicsLength = p_topics.length;
        if (pagerValue) {
          if (this.startIndex < this.topicsLength - this.pageLength) {
            this.startIndex += this.pageLength;
          }
        } else {
          if (this.startIndex > this.pageLength) {
            this.startIndex -= this.pageLength;
          } else {
            this.startIndex = 0;
          }
        }
        if (this.startIndex > p_topics.length) {
          this.startIndex = 0;
        }
        this.pagedTopics = p_topics.slice(this.startIndex, this.startIndex + this.pageLength);
      }
    );
    this.pageEmitter.next(false); // to get things started
  }

  setPage(up: boolean) {
    this.pageEmitter.next(up);
  }

  onSelectTopic(topic: Topic) {
    if (!this.embeddingComponent) {
      this.router.navigate([topic.id], {relativeTo: this.route});
    } else {
      this.topicSelected.emit(topic);
    }
  }

}
