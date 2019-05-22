import { IoTService } from '../iot-service.model';
import * as fromIoTServiceActions from './iot-service.actions';
import * as fromRoot from '../../store/app.reducers';
import { createFeatureSelector, createSelector } from '@ngrx/store';


// export interface FeatureState {
//     services: State;
// }

export interface State {
    services: IoTService[];
    selectedService: IoTService;
    serviceOntology: string[];
}

const initialState = {
    services: [],
    selectedService: null,
    serviceOntology: []
};

export function serviceReducer (state: State = initialState,
                                action: fromIoTServiceActions.IoTServiceActions): State {
    switch (action.type) {
        case fromIoTServiceActions.SET_IoTSERVICES:
            return {
                ...state,
                services: [...action.payload]
            };
        case fromIoTServiceActions.SET_DETAILED_SERVICE:
            return {
                ...state,
                selectedService: action.payload,
            };
        case fromIoTServiceActions.STOP_SELECT_SERVICE:
            return {
                ...state,
                selectedService: null
            };
        case fromIoTServiceActions.STOP_REQUEST_SERVICE:
            const received_service = action.payload;
            const requestedService = {
                ...state.selectedService,
                ...received_service
            };
            return {
                ...state,
                selectedService: requestedService
            };
        case fromIoTServiceActions.STOP_CREATE_IoTSERVICE:
            return {
                ...state,
                services: [...state.services, action.payload],
                selectedService: action.payload
            };
        case fromIoTServiceActions.STOP_DELETE_IoTSERVICE:
            const updated_services = [...state.services].filter((item) => {
              return item.id !== action.payload;
            });
            return {
                ...state,
                services: updated_services,
                selectedService: null
            };

        case fromIoTServiceActions.SERVICE_FILE_UPLOADED:
          {
            const service = state.services.find(updated_service => updated_service.id === action.payload);
            const updatedService = {
                ...service,
                service_file_is_uploaded:  true
            };
            const services = [...state.services];
            const index = services.indexOf(service);
            if (index !== -1) {
                services[index] = updatedService;
            }
            return {
                ...state,
                services: services
            };
          }
        case fromIoTServiceActions.UPDATE_SERVICE_STATUS:
        {
            const service = state.services.find(updated_service => updated_service.id === action.payload.service_id);
            const updatedService = {
                ...service,
                service_is_running:  action.payload.status
            };
            const services = [...state.services];
            const index = services.indexOf(service);
            if (index !== -1) {
                services[index] = updatedService;
            }
            return {
                ...state,
                services: services
            };
          }
        case fromIoTServiceActions.SET_SERVICE_ONTOLOGY:
          return {
              ...state,
              serviceOntology: action.payload
          };
        case fromIoTServiceActions.CLEAR_IoT_SERVICES_STATE:
        {
            return {
                ...state,
                services: [],
                selectedService: null,
                serviceOntology: []
            };
        }
        default:
            return state;
    }
}

export interface ServicesState extends fromRoot.AppState {
    services: State;
}


export const _getServices = (state: State) => state.services;
export const _getServiceOntology = (state: State) => state.serviceOntology;
export const getServicesState = createFeatureSelector<State>('services');
export const getServices = createSelector(getServicesState, _getServices);
export const getServiceOntology = createSelector(getServicesState, _getServiceOntology);
