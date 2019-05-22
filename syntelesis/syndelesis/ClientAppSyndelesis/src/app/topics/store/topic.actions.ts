import { Action } from '@ngrx/store';

import { Topic, DetailedTopicModel, TopicSearchType } from '../../shared/topic.model';

export const FETCH_TOPICS = '[Topics] Fetch topics';
export const SET_TOPICS = '[Topics] Set topics';
export const START_SELECT_TOPIC = '[Topics] Fetch selected topic';
export const SET_DETAILED_TOPIC = '[Topics] Set detailed topic';
export const STOP_EDIT = '[Topics] Stop edit topic';
export const ADD_TOPIC = '[Topics] Add topic';
export const STOP_ADD_TOPIC = '[Topics] Stop add topic';
export const REQUEST_TOPIC = '[Topics] Request topic';
export const STOP_REQUEST_TOPIC = '[Topics] Stop request topic';
export const DELETE_TOPIC = '[Topics] Delete topic';
export const STOP_DELETE_TOPIC = '[Topics] Stop delete topic';
export const NET_SUCCESS = '[Topics] Net success';
export const REDIRECT = '[Topics] Redirect';
export const NET_FAILED = '[Topics] Net failed';
export const ADD_TOPICS = '[Topics] Add topics';
export const SEARCH = '[Topics] Search';
export const CLEAR_TOPICS_STATE = '[Topics] Clear topics state';

export class FetchTopics implements Action {
    readonly type = FETCH_TOPICS;

    constructor(public payload: TopicSearchType) {}
}

export class SetTopics implements Action {
    readonly type = SET_TOPICS;

    constructor(public payload: Topic[]) {}
}

export class StartSelectTopic implements Action {
    readonly type = START_SELECT_TOPIC;

    constructor(public payload: number) {}
}

export class SetDetailedTopic implements Action {
    readonly type = SET_DETAILED_TOPIC;

    constructor(public payload: DetailedTopicModel) {}
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT; // ...STOP_SELECT_TOPIC
}

export class AddTopic implements Action {
    readonly type = ADD_TOPIC;

    constructor(public payload: Topic) {}
}

export class StopAddTopic implements Action {
    readonly type = STOP_ADD_TOPIC;

    constructor(public payload: Topic) {}
}

export class RequestTopic implements Action {
    readonly type = REQUEST_TOPIC;

    constructor(public payload: number) {}
}

export class StopRequestTopic implements Action {
    readonly type = STOP_REQUEST_TOPIC;

    constructor(public payload: Topic) {}
}

export class DeleteTopic implements Action {
  readonly type = DELETE_TOPIC;

  constructor(public payload: number) {}
}

export class StopDeleteTopic implements Action {
  readonly type = STOP_DELETE_TOPIC;

  constructor(public payload: number) {}
}

export class Search implements Action {
    readonly type = SEARCH;

    constructor(public payload: string) {}
}

export class ClearTopicsState implements Action {
    readonly type = CLEAR_TOPICS_STATE;
    constructor() {}
}

export class Redirect implements Action {
    readonly type = REDIRECT;

    constructor(public payload) {}
}

// export class AddTopics implements Action {
//     readonly type = ADD_TOPICS;

//     constructor(public payload: Topic[]) {}
// }

export class NetFailed implements Action {
    readonly type = NET_FAILED;

    constructor(public payload) {}
}

export class NetSuccess implements Action {
    readonly type = NET_SUCCESS;

    constructor(public payload) {}
}

export type TopicActions = FetchTopics|
                           SetTopics|
                           StartSelectTopic|
                           StopEdit|
                           SetDetailedTopic|
                           AddTopic|
                           StopAddTopic|
                           RequestTopic|
                           StopRequestTopic|
                           DeleteTopic|
                           StopDeleteTopic|
                           ClearTopicsState|
                           Redirect|
                           NetSuccess|
                           NetFailed|
                           Search;
