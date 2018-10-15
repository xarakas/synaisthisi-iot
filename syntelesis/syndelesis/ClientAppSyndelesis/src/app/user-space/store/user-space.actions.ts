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

export class GetUserOwnedServices implements Action {
  readonly type = GET_USER_OWNED_SERVICES;
}

export class UploadServiceFile implements Action {
  readonly type = UPLOAD_SERVICE_FILE;

  constructor(public payload: { service_id: number; uploadData: FormData }) {}
}

export class StartService implements Action {
  readonly type = START_SERVICE;

  constructor(
    public payload: { service_id: number; serviceParam: string }
  ) {}
}

export class StopService implements Action {
  readonly type = STOP_SERVICE;

  constructor(
    public payload: { service_id: number}
  ) {}
}

export class GetServiceStatus implements Action {
  readonly type = GET_SERVICE_STATUS;

  constructor(
    public payload: { service_id: number}
  ) {}
}

export class ExportUserServices implements Action {
  readonly type = EXPORT_SERVICES;
}

export class GetServiceLogFile implements Action {
  readonly type = GET_SERVICE_LOG_FILE;

  constructor(
    public payload: { service_id: number}
  ) {}
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
  | GetUserOwnedServices
  | UploadServiceFile
  | StartService
  | StopService
  | GetServiceStatus
  | ExportUserServices
  | GetServiceLogFile
  | NetSuccess
  | NetFailed;
