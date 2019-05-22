
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Topic } from '../shared/topic.model';


@Injectable()
export class TopicsService {

  private url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getTopics(searchUrl: string): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(
        `${this.url}${searchUrl}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  createTopic(topic: Topic): Observable<Topic> {
    return this.httpClient.post<Topic>(
        `${this.url}topics`, topic, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  getUserTopic(user_id: number, topic_id: number): Observable<Topic> {
    return this.httpClient.get<Topic>(
        `${this.url}users/${user_id}/topics/${topic_id}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  requestUserTopic(user_id: number, topic_id: number): Observable<Topic> {
    return this.httpClient.put<Topic>(
        `${this.url}users/${user_id}/topics/${topic_id}`, {}, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  deleteUserTopic(user_id: number, topic_id: number): Observable<any> {
    return this.httpClient.delete(
        `${this.url}users/${user_id}/topics/${topic_id}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }

  searchTopics(term: string): Observable<Topic[]> {
    return this.httpClient.get<Topic[]>(
        `${this.url}topics?term=${term}`, { observe: 'body', responseType: 'json' }
    )
    .pipe(catchError((err: HttpErrorResponse) => observableThrowError(err.error)));
  }
}
