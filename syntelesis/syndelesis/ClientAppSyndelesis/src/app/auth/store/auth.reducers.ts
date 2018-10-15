import * as fromAuthActions from './auth.actions';
import { UserData } from '../../shared/authData.model';

export interface State {
    token: string;
    refreshToken: string;
    authenticated: boolean;
    userData: UserData;
    loading: boolean;
    refreshing: boolean;
}

const initialState: State = {
    token: null,
    refreshToken: null,
    authenticated: false,
    userData: null,
    loading: false,
    refreshing: false
};

export function authReducer (state = initialState, action: fromAuthActions.AuthActions): State {
    switch (action.type) {
        case fromAuthActions.SIGNUP:
        case fromAuthActions.SIGNIN:
            return {
                ...state,
                authenticated: true,
                loading: false
            };
        case fromAuthActions.LOGOUT:
            return {
                ...state,
                token: null,
                refreshToken: null,
                authenticated: false,
                userData: null,
                loading: false
            };
        case fromAuthActions.SET_TOKEN:
            return {
                ...state,
                token: action.payload,
                refreshing: false // meaningful in refresh ends
            };
        case fromAuthActions.SET_REFRESH_TOKEN:
            return {
                ...state,
                refreshToken: action.payload
            };
        case fromAuthActions.SET_USERDATA:
            return {
                ...state,
                userData: action.payload
            };
        case fromAuthActions.DO_SIGNUP:
        case fromAuthActions.DO_SIGNIN:
            return {
                ...state,
                loading: true
            };
        case fromAuthActions.REFRESH_TOKEN:
            return {
                ...state,
                refreshing: true  // refresh starts
            };
        case fromAuthActions.AUTH_FAILED:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
}

export const getAuthLoading = (state: State) => state.loading;
export const getAuthRefreshing = (state: State) => state.refreshing;
export const getAuthenticated = (state: State) => state.authenticated;
export const getAuthToken = (state: State) => state.token;
export const getAuthRefreshToken = (state: State) => state.refreshToken;
export const getUserData = (state: State) => state.userData;
