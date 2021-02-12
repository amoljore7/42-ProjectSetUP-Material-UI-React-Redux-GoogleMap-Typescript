import {
  NEAR_BY_RESOURCES_LOADING,
  NEAR_BY_RESOURCES_SUCCESS,
  NEAR_BY_RESOURCES_FAIL,
  DELETE_RESOURCE_SUCCESS,
  DELETE_RESOURCE_FAIL
} from '../types';
import { nearByResource, latLngForPatientAddress } from '../saga';

export const noErrorMessage = 'No Error';

export interface DefaultState {
  nearByResourcesLoading: boolean;
  nearByResources: nearByResource[];
  latLngForPatientAddress: latLngForPatientAddress;
  addressInput: string;
  resourceInput: string;
  siteInput: string;
  nearByResourcesError: string;
  deletionError: string;
}

const defaultState: DefaultState = {
  nearByResourcesLoading: false,
  nearByResources: [],
  latLngForPatientAddress: { address: '', lat: '', lng: '' },
  addressInput: '',
  resourceInput: '',
  siteInput: '',
  nearByResourcesError: noErrorMessage,
  deletionError: ''
};

interface payload {
  nearByResources: nearByResource[];
  latLngForPatientAddress: latLngForPatientAddress;
  resources_fields: string;
  address: string;
  resource: string;
  error: string;
  resourceIdToBeDeleted: string;
  deletionError: string;
}

interface actionType {
  type: string;
  payload: payload;
}

export const nearByResourcesReducer = (
  state: DefaultState = defaultState,
  action: actionType
): DefaultState => {
  switch (action.type) {
    case NEAR_BY_RESOURCES_LOADING:
      return {
        ...state,
        nearByResourcesLoading: true
      };
    case NEAR_BY_RESOURCES_SUCCESS:
      return {
        ...state,
        nearByResourcesLoading: false,
        nearByResources: action.payload.nearByResources,
        latLngForPatientAddress: action.payload.latLngForPatientAddress,
        nearByResourcesError: ''
      };
    case 'SAVE_SITE_AND_RESOURCE_CATEGORY':
      return {
        ...state,
        addressInput: action.payload.address,
        resourceInput: action.payload.resource
        // siteInput: action.payload.site
      };
    case NEAR_BY_RESOURCES_FAIL:
      return {
        ...state,
        nearByResourcesLoading: false,
        nearByResources: [],
        nearByResourcesError: action.payload.error
      };
    case DELETE_RESOURCE_SUCCESS: {
      const filteredNearByResources = state.nearByResources.filter(
        (resource: nearByResource) =>
          resource.resourceId !== parseInt(action.payload.resourceIdToBeDeleted)
      );
      return {
        ...state,
        nearByResources: filteredNearByResources
      };
    }
    case DELETE_RESOURCE_FAIL: {
      return {
        ...state,
        deletionError: action.payload.deletionError
      };
    }
    default:
      return state;
  }
};
