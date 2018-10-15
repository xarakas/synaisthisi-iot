import { IoTService } from '../iot-service.model';
import * as fromIoTServiceActions from './iot-service.actions';

export interface State {
    services: IoTService[];
    selectedService: IoTService;
}

const initialState = {
    services: [],
    selectedService: null
};

export function serviceReducer (state = initialState,
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
        case fromIoTServiceActions.CLEAR_IoT_SERVICES_STATE:
        {
            return {
                ...state,
                services: [],
                selectedService: null
            };
        }
        default:
            return state;
    }
}
