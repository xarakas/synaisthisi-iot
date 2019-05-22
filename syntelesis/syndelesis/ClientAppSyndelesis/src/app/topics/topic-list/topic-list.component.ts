import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable,  Subject ,  combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Topic, TopicSearchType } from '../../shared/topic.model';
import * as fromApp from '../../store/app.reducers';
import * as fromTopicActions from '../store/topic.actions';
import { getTopics } from '../store/topic.reducers';


@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.css']
})
export class TopicListComponent implements OnInit, OnDestroy {
  // The following two are used to act upon topic selection when copmonent embedded in New Service Component
  @Input() embeddingComponent: string = null;
  @Output() topicSelected = new EventEmitter<Topic>();

  private topicsState$: Observable<Topic[]>;
  private pageEmitter = new Subject<boolean>();
  private ngUnsubscribe = new Subject<boolean>();

  public pagedTopics: Topic[];
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
    this.topicsState$ = this.store.select(getTopics);

    combineLatest(this.topicsState$, this.pageEmitter).pipe(
      takeUntil(this.ngUnsubscribe)
      ).subscribe(
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
