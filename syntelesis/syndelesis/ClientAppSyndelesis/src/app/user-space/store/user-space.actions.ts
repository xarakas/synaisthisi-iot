import { Action } from '@ngrx/store';

export const GET_USER_DATA = '[User Space] Get User Data';
export const UPDATE_USER_DATA = '[USer Space] Update User Data';
export const GET_USER_OWNED_SERVICES = '[User Space] Get user owned services';
export const UPLOAD_SERVICE_FILE = '[User Space] Upload service file';
export const START_SERVICE = '[User Space] Start service';
export const STOP_SERVICE = '[User Space] Stop service';
export const GET_SERVICE_STATUS = '[User Space] Get service status';
export const EXPORT_SERVICES = '[User Space] Export user services';
export const GET_SERVICE_LOG_FILE = '[User Space] Get service log file';
export const NET_SUCCESS = '[User Space] Net Success';
export const NET_FAILED = '[User Space] Net Failed';

export class GetUserData implements Action {
  readonly type = GET_USER_DATA;
}

export class UpdateUserData implements Action {
  readonly type = UPDATE_USER_DATA;

  constructor(public payload: { email: string; password: string }) {}
}

export class NetFailed implements Action {
  readonly type = NET_FAILED;

  constructor(public payload) {}
}

export class NetSuccess implements Action {
  readonly type = NET_SUCCESS;

  constructor(public payload) {}
}

export type UserSpaceActions =
  | GetUserData
  | UpdateUserData
  | NetSuccess
  | NetFailed;
