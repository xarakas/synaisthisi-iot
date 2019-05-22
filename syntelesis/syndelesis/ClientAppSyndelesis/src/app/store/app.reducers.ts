import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromAuth from '../auth/store/auth.reducers';
import * as fromTopics from '../topics/store/topic.reducers';
import * as fromIoTService from '../iot-services/store/iot-service.reducers';

export interface AppState {
    auth: fromAuth.State;
    topics: fromTopics.State;
    // services: fromIoTService.State; // LAZY
}

export const reducers: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    topics: fromTopics.topicReducer,
    // services: fromIoTService.serviceReducer // LAZY
};

export const getAuthState = createFeatureSelector('auth');
export const getAuthLoading = createSelector(getAuthState, fromAuth.getAuthLoading);
export const getAuthRefreshing = createSelector(getAuthState, fromAuth.getAuthRefreshing);
export const getAuthenticated = createSelector(getAuthState, fromAuth.getAuthenticated);
export const getAuthToken = createSelector(getAuthState, fromAuth.getAuthToken);
export const getAuthRefreshToken = createSelector(getAuthState, fromAuth.getAuthRefreshToken);
export const getUserData = createSelector(getAuthState, fromAuth.getUserData);

