import { Action } from '@ngrx/store';

import { UserData } from '../../shared/authData.model';

export const DO_SIGNUP = '[Auth] DO_SIGNUP';
export const SIGNUP = '[Auth] SIGNUP';
export const DO_SIGNIN = '[Auth] DO_SIGNIN';
export const SIGNIN = '[Auth] SIGNIN';
export const LOGOUT = '[Auth] LOGOUT';
export const DO_LOGOUT = '[Auth] DO_LOGOUT';
export const SET_TOKEN = '[Auth] SET_TOKEN';
export const SET_REFRESH_TOKEN = '[Auth] SET_REFRESH_TOKEN';
export const SET_USERDATA = '[Auth] SET_USERDATA';
export const REFRESH_TOKEN = '[Auth] REFRESH_TOKEN';
export const REDIRECT = '[Auth] REDIRECT';
export const AUTH_FAILED = '[Auth] AUTH_FAILED';
export const AUTH_SUCCESS = '[Auth] AUTH_SUCCESS';

export class DoSignup implements Action {
    readonly type = DO_SIGNUP;

    constructor(public payload: {username: string, password: string, email: string}) {}
}

export class Signup implements Action {
    readonly type = SIGNUP;
}

export class DoSignin implements Action {
    readonly type = DO_SIGNIN;

    constructor(public payload: {username: string, password: string, navigateUrl: string}) {}
}

export class Signin implements Action {
    readonly type = SIGNIN;
}

export class AuthFailed implements Action {
    readonly type = AUTH_FAILED;

    constructor(public payload) {}
}

export class AuthSuccess implements Action {
    readonly type = AUTH_SUCCESS;

    constructor(public payload) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class DoLogout implements Action {
    readonly type = DO_LOGOUT;
}

export class SetToken implements Action {
    readonly type = SET_TOKEN;

    constructor(public payload: string) {}
}

export class SetRefreshToken implements Action {
    readonly type = SET_REFRESH_TOKEN;

    constructor(public payload: string) {}
}

export class SetUserData implements Action {
    readonly type = SET_USERDATA;

    constructor(public payload: UserData) {}
}

export class RefreshToken implements Action {
    readonly type = REFRESH_TOKEN;
}


export type AuthActions = Signin |
                          Signup |
                          Logout |
                          SetToken|
                          SetRefreshToken|
                          SetUserData|
                          DoSignup|
                          DoSignin|
                          DoLogout|
                          RefreshToken|
                          AuthFailed|
                          AuthSuccess;
