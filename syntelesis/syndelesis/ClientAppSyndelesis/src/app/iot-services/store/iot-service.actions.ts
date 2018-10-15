import { Action } from '@ngrx/store';

import { IoTService } from '../iot-service.model';

export const FETCH_IoTSERVICES = '[IoTServices] Fetch IoTServices';
export const SET_IoTSERVICES = '[IoTServices] Set IoTServices';
export const START_SELECT_SERVICE = '[IoTServices] Start select service';
export const SET_DETAILED_SERVICE = '[IoTServices] Set detailed service';
export const STOP_SELECT_SERVICE = '[IoTServices] Stop select service';
export const REQUEST_SERVICE = '[IoTServices] Request service';
export const STOP_REQUEST_SERVICE = '[IoTServices] Stop request service';
export const CREATE_IoTSERVICE = '[IoTServices] Create IoTService';
export const STOP_CREATE_IoTSERVICE = '[IoTServices] Stop create IoTService';
export const SERVICE_FILE_UPLOADED = '[IoTServices (User Space initiated)] Service file uploaded';
export const UPDATE_SERVICE_STATUS = '[IoTServices (User Space initiated)] Update service status';
export const CLEAR_IoT_SERVICES_STATE = '[IoTServices] Clear service state';
export const NET_FAILED = '[IoTServices] Net failed';
export const NET_SUCCESS = '[IoTServices] Net success';
export const REDIRECT = '[IoTServices] Redirect';

export class FetchIoTServices implements Action {
    readonly type = FETCH_IoTSERVICES;

    constructor(public payload?) {} // payload => parmas e.g term=ano ...
}

export class SetIoTServices implements Action {
    readonly type = SET_IoTSERVICES;

    constructor(public payload: IoTService[]) {}
}

export class StartSelectIoTService implements Action {
    readonly type = START_SELECT_SERVICE;

    constructor(public payload: number) {}
}

export class SetDetailedIoTService implements Action {
    readonly type = SET_DETAILED_SERVICE;

    constructor(public payload: IoTService) {}
}

export class StopSelectIoTService implements Action {
    readonly type = STOP_SELECT_SERVICE;
}

export class RequestIoTService implements Action {
    readonly type = REQUEST_SERVICE;

    constructor(public payload: number) {}
}

export class StopRequestIoTService implements Action {
    readonly type = STOP_REQUEST_SERVICE;

    constructor(public payload: IoTService) {}
}

export class CreateIoTService implements Action {
    readonly type = CREATE_IoTSERVICE;

    constructor(public payload: IoTService) {}
}

export class StopCreateToTService implements Action {
    readonly type = STOP_CREATE_IoTSERVICE;

    constructor(public payload: IoTService) {}
}

export class ServiceFileUploaded implements Action {
    readonly type = SERVICE_FILE_UPLOADED;

    constructor(public payload: number) {}
}

export class UpdateServiceStatus implements Action {
    readonly type = UPDATE_SERVICE_STATUS;

    constructor(public payload: {service_id: number, status: boolean}) {}
}

export class ClearIoTServicesState implements Action {
    readonly type = CLEAR_IoT_SERVICES_STATE;

    constructor() {}
}

export class NetFailed implements Action {
    readonly type = NET_FAILED;

    constructor(public payload) {}
}

export class NetSuccess implements Action {
    readonly type = NET_SUCCESS;

    constructor(public payload) {}
}

export class Redirect implements Action {
    readonly type = REDIRECT;

    constructor(public payload) {}
}

export type IoTServiceActions = FetchIoTServices|
                                SetIoTServices|
                                StartSelectIoTService|
                                SetDetailedIoTService|
                                StopSelectIoTService|
                                RequestIoTService|
                                StopRequestIoTService|
                                CreateIoTService|
                                StopCreateToTService|
                                ServiceFileUploaded|
                                UpdateServiceStatus|
                                ClearIoTServicesState|
                                NetFailed|
                                NetSuccess|
                                Redirect;
