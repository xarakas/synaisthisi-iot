import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { of } from 'rxjs';
import {
  map,
  switchMap,
  mergeMap,
  withLatestFrom,
  catchError,
  tap
} from 'rxjs/operators';

import * as fromApp from '../../store/app.reducers';
import * as fromTopicActions from './topic.actions';
import { Topic, TopicSearchType } from '../../shared/topic.model';
import { TopicsService } from '../topics.service';
import { AlertService } from '../../shared/alert.service';

@Injectable()
export class TopicEffects {
  constructor(
    private actions$: Actions,
    private service: TopicsService,
    private store: Store<fromApp.AppState>,
    private alertService: AlertService,
    private router: Router
  ) {}

  @Effect()
  topicsFetch = this.actions$.pipe(
    ofType<fromTopicActions.FetchTopics>(fromTopicActions.FETCH_TOPICS),
    withLatestFrom(this.store.select('auth')),
    switchMap(([action, state]) => {
      const user_id = state.userData.id;
      let searchUrl = '';
      switch (action.payload) {
        case TopicSearchType.allTopics:
          searchUrl = `topics`;
          break;
        case TopicSearchType.userSubPermittedTopics:
          searchUrl = `users/${user_id}/topics`;
          break;
      }
      return this.service.getTopics(searchUrl).pipe(
        mergeMap((topics: Topic[]) => {
          return [
            {
              type: fromTopicActions.SET_TOPICS,
              payload: topics
            },
            {
              type: fromTopicActions.NET_SUCCESS,
              payload: {
                message: 'Successfully retrieved all topics',
                redirectUrl: '/topics'
              }
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromTopicActions.NET_FAILED, payload: error });
        })
      );
    })
  );

  @Effect()
  startSelectTopic = this.actions$
    .pipe(
      ofType(fromTopicActions.START_SELECT_TOPIC),
      map((action: fromTopicActions.StartSelectTopic) => {
        return action.payload;
      }),
      withLatestFrom(this.store.select('auth')),
      switchMap(([topic_id, state]) => {
        const user_id = state.userData.id;
        return this.service.getUserTopic(user_id, topic_id).pipe(
          mergeMap((topic: Topic) => {
            return [
              {
                type: fromTopicActions.SET_DETAILED_TOPIC,
                payload: topic
              },
              {
                type: fromTopicActions.NET_SUCCESS,
                payload: {
                  message: 'Successfully retrieved slected topic',
                  redirectUrl: '/topics'
                }
              }
            ];
          }),
          catchError(error => {
            return of({ type: fromTopicActions.NET_FAILED, payload: error });
          })
        );
      })
    );

  @Effect()
  addTopic = this.actions$.pipe(
    ofType(fromTopicActions.ADD_TOPIC),
    map((action: fromTopicActions.AddTopic) => {
      return action.payload;
    }),
    switchMap((topic: Topic) => {
      return this.service.createTopic(topic).pipe(
        mergeMap((response: Topic) => {
          return [
            {
              type: fromTopicActions.STOP_ADD_TOPIC,
              payload: response
            },
            {
              type: fromTopicActions.NET_SUCCESS,
              payload: { message: 'Successfully created Topic' }
            },
            {
              type: fromTopicActions.REDIRECT,
              payload: `topics/${response.id}`
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromTopicActions.NET_FAILED, payload: error });
        })
      );
    })
  );

  @Effect()
  requestTopic = this.actions$.pipe(
    ofType(fromTopicActions.REQUEST_TOPIC),
    map((action: fromTopicActions.RequestTopic) => {
      return action.payload;
    }),
    withLatestFrom(this.store.select('auth')),
    switchMap(([topic_id, state]) => {
      const user_id = state.userData.id;
      return this.service.requestUserTopic(user_id, topic_id).pipe(
        mergeMap((response: Topic) => {
          return [
            {
              type: fromTopicActions.STOP_REQUEST_TOPIC,
              payload: response
            },
            {
              type: fromTopicActions.NET_SUCCESS,
              payload: { message: 'SUB Permission granted' }
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromTopicActions.NET_FAILED, payload: error });
        })
      );
    })
  );

  @Effect()
  deleteTopic = this.actions$.pipe(
    ofType(fromTopicActions.DELETE_TOPIC),
    map((action: fromTopicActions.DeleteTopic) => {
      return action.payload;
    }),
    withLatestFrom(this.store.select('auth')),
    switchMap(([topic_id, state]) => {
      const user_id = state.userData.id;
      return this.service.deleteUserTopic(user_id, topic_id).pipe(
        mergeMap((response: string) => {
          console.log(response);
          return [
            {
              type: fromTopicActions.STOP_DELETE_TOPIC,
              payload: topic_id
            },
            {
              type: fromTopicActions.REDIRECT,
              payload: 'topics'
            },
            // {
            //   type: fromTopicActions.SEARCH,
            //   payload: ''
            // },
            {
              type: fromTopicActions.NET_SUCCESS,
              payload: { message: response['message'] }
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromTopicActions.NET_FAILED, payload: error });
        })
      );
    })
  );


  @Effect()
  search = this.actions$.pipe(
    ofType(fromTopicActions.SEARCH),
    map((action: fromTopicActions.Search) => {
      return action.payload;
    }),
    switchMap(term => {
      return this.service.searchTopics(term).pipe(
        mergeMap((topics: Topic[]) => {
          return [
            {
              type: fromTopicActions.SET_TOPICS,
              payload: topics
            },
            {
              type: fromTopicActions.NET_SUCCESS,
              payload: {
                message: 'Successfully retrieved all topics',
                redirectUrl: '/topics'
              }
            }
          ];
        }),
        catchError(error => {
          return of({ type: fromTopicActions.NET_FAILED, payload: error });
        })
      );
    })
  );

  @Effect({ dispatch: false })
  failed = this.actions$.pipe(
    ofType(fromTopicActions.NET_FAILED),
    tap((action: fromTopicActions.NetFailed) => {
      this.alertService.error(action.payload['message']);
    })
  );

  @Effect({ dispatch: false })
  success = this.actions$.pipe(
    ofType(fromTopicActions.NET_SUCCESS),
    tap((action: fromTopicActions.NetSuccess) => {
      // this.router.navigate([action.payload.redirectUrl]);
      this.alertService.success(action.payload.message);
    })
  );

  @Effect({ dispatch: false })
  redirect = this.actions$.pipe(
    ofType(fromTopicActions.REDIRECT),
    tap((action: fromTopicActions.Redirect) => {
      this.router.navigate([action.payload]);
    })
  );
}
